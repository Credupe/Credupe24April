import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { LoanType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { buildOrderBy, paged, paginate } from '../common/dto/pagination.dto';
import { EligibilityQueryDto, UpsertLoanProductDto } from './dto/loan-product.dto';
import { REDIS_CLIENT } from '../redis/redis.module';
import type Redis from 'ioredis';

const CACHE_TTL = 120;

@Injectable()
export class LoanProductsService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(REDIS_CLIENT) private readonly redis: Redis,
  ) {}

  async list(q: { page?: number; pageSize?: number; loanType?: LoanType; search?: string; sort?: string; active?: string }) {
    const cacheKey = `lp:list:${JSON.stringify(q)}`;
    const cached = await this.redis.get(cacheKey).catch(() => null);
    if (cached) return JSON.parse(cached);

    const { skip, take, page, pageSize } = paginate(q.page, q.pageSize);
    const where: any = { deletedAt: null };
    if (q.loanType) where.loanType = q.loanType;
    if (q.active !== undefined) where.active = q.active === 'true';
    if (q.search) where.name = { contains: q.search, mode: 'insensitive' };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.loanProduct.findMany({
        where, skip, take,
        orderBy: buildOrderBy(q.sort, ['createdAt', 'minInterestRate', 'name']),
        include: { lender: { select: { id: true, name: true, slug: true, logoUrl: true } } },
      }),
      this.prisma.loanProduct.count({ where }),
    ]);
    const out = paged(items, total, page, pageSize);
    await this.redis.set(cacheKey, JSON.stringify(out), 'EX', CACHE_TTL).catch(() => null);
    return out;
  }

  async getBySlug(slug: string) {
    const p = await this.prisma.loanProduct.findUnique({
      where: { slug },
      include: { lender: true },
    });
    if (!p) throw new NotFoundException();
    return p;
  }

  async create(dto: UpsertLoanProductDto, actor?: string) {
    await this.invalidate();
    return this.prisma.loanProduct.create({
      data: { ...dto, createdBy: actor, updatedBy: actor },
    });
  }

  async update(id: string, dto: Partial<UpsertLoanProductDto>, actor?: string) {
    await this.invalidate();
    return this.prisma.loanProduct.update({
      where: { id },
      data: { ...dto, version: { increment: 1 }, updatedBy: actor },
    });
  }

  async remove(id: string, actor?: string) {
    await this.invalidate();
    await this.prisma.loanProduct.update({
      where: { id }, data: { deletedAt: new Date(), updatedBy: actor },
    });
    return { id };
  }

  /** Match customer → eligible products (rule engine MVP). */
  async matchOffers(q: EligibilityQueryDto) {
    const where: any = {
      deletedAt: null,
      active: true,
      loanType: q.loanType,
      minAmount: { lte: q.amount },
      maxAmount: { gte: q.amount },
    };
    if (q.monthlyIncome) where.OR = [{ minMonthlyIncome: null }, { minMonthlyIncome: { lte: q.monthlyIncome } }];
    if (q.cibilScore) where.AND = [{ OR: [{ minCibilScore: null }, { minCibilScore: { lte: q.cibilScore } }] }];

    const candidates = await this.prisma.loanProduct.findMany({
      where,
      include: { lender: { select: { id: true, name: true, slug: true, logoUrl: true } } },
      orderBy: { minInterestRate: 'asc' },
    });

    // post-filter for geo (arrays can't be done with simple prisma predicates)
    const filtered = candidates.filter((p) => {
      if (q.city && p.allowedCities?.length && !p.allowedCities.includes(q.city)) return false;
      if (q.state && p.allowedStates?.length && !p.allowedStates.includes(q.state)) return false;
      if (q.tenureMonths && (q.tenureMonths < p.minTenureMonths || q.tenureMonths > p.maxTenureMonths)) return false;
      return true;
    });

    return {
      count: filtered.length,
      offers: filtered.map((p) => ({
        productId: p.id,
        productName: p.name,
        productSlug: p.slug,
        lender: p.lender,
        loanType: p.loanType,
        interestRateRange: { min: p.minInterestRate, max: p.maxInterestRate },
        amountRange: { min: p.minAmount, max: p.maxAmount },
        tenureRange: { minMonths: p.minTenureMonths, maxMonths: p.maxTenureMonths },
        processingFeePct: p.processingFeePct,
        prequalifiedAmount: Number(p.maxAmount) < q.amount ? Number(p.maxAmount) : q.amount,
      })),
    };
  }

  private async invalidate() {
    const keys = await this.redis.keys('lp:list:*').catch(() => [] as string[]);
    if (keys.length) await this.redis.del(...keys).catch(() => null);
  }
}
