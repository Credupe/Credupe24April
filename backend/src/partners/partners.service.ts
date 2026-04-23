import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { KycStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { buildOrderBy, paged, paginate } from '../common/dto/pagination.dto';
import { UpsertPartnerProfileDto } from './dto/partner.dto';

@Injectable()
export class PartnersService {
  constructor(private readonly prisma: PrismaService) {}

  async getMine(userId: string) {
    const p = await this.prisma.partnerProfile.findUnique({ where: { userId } });
    if (!p) throw new NotFoundException('Partner profile not found');
    return p;
  }

  async upsertMine(userId: string, dto: UpsertPartnerProfileDto) {
    const panLast4 = dto.pan ? dto.pan.slice(-4) : undefined;
    const { pan, ...rest } = dto;
    const data = { ...rest, ...(panLast4 ? { panLast4 } : {}), updatedBy: userId };
    const existing = await this.prisma.partnerProfile.findUnique({ where: { userId } });
    if (!existing) {
      if (!dto.businessName) throw new BadRequestException('businessName required');
      return this.prisma.partnerProfile.create({
        data: { userId, businessName: dto.businessName, ...data, createdBy: userId },
      });
    }
    return this.prisma.partnerProfile.update({ where: { userId }, data });
  }

  async list(q: { page?: number; pageSize?: number; search?: string; sort?: string; kycStatus?: KycStatus }) {
    const { skip, take, page, pageSize } = paginate(q.page, q.pageSize);
    const where: any = { deletedAt: null };
    if (q.kycStatus) where.kycStatus = q.kycStatus;
    if (q.search) where.businessName = { contains: q.search, mode: 'insensitive' };
    const [items, total] = await this.prisma.$transaction([
      this.prisma.partnerProfile.findMany({
        where,
        skip, take,
        orderBy: buildOrderBy(q.sort, ['createdAt', 'businessName']),
        include: { user: { select: { id: true, email: true, mobile: true, isActive: true } } },
      }),
      this.prisma.partnerProfile.count({ where }),
    ]);
    return paged(items, total, page, pageSize);
  }

  async setKyc(id: string, status: KycStatus, actorId: string) {
    const p = await this.prisma.partnerProfile.findUnique({ where: { id } });
    if (!p) throw new NotFoundException();
    return this.prisma.partnerProfile.update({
      where: { id },
      data: { kycStatus: status, updatedBy: actorId },
    });
  }
}
