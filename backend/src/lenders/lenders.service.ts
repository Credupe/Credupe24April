import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { buildOrderBy, paged, paginate } from '../common/dto/pagination.dto';
import { UpsertLenderDto } from './dto/lender.dto';

@Injectable()
export class LendersService {
  constructor(private readonly prisma: PrismaService) {}

  async list(q: { page?: number; pageSize?: number; search?: string; sort?: string; active?: string }) {
    const { skip, take, page, pageSize } = paginate(q.page, q.pageSize);
    const where: any = { deletedAt: null };
    if (q.active !== undefined) where.active = q.active === 'true';
    if (q.search) where.name = { contains: q.search, mode: 'insensitive' };
    const [items, total] = await this.prisma.$transaction([
      this.prisma.lender.findMany({
        where, skip, take, orderBy: buildOrderBy(q.sort, ['createdAt', 'name']),
      }),
      this.prisma.lender.count({ where }),
    ]);
    return paged(items, total, page, pageSize);
  }

  async create(dto: UpsertLenderDto, actor?: string) {
    return this.prisma.lender.create({ data: { ...dto, createdBy: actor, updatedBy: actor } });
  }

  async update(id: string, dto: Partial<UpsertLenderDto>, actor?: string) {
    const found = await this.prisma.lender.findUnique({ where: { id } });
    if (!found) throw new NotFoundException();
    return this.prisma.lender.update({ where: { id }, data: { ...dto, updatedBy: actor } });
  }

  async remove(id: string, actor?: string) {
    await this.prisma.lender.update({ where: { id }, data: { deletedAt: new Date(), updatedBy: actor } });
    return { id };
  }
}
