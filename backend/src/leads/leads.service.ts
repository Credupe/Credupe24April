import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { LeadStatus, Role } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { buildOrderBy, paged, paginate } from '../common/dto/pagination.dto';
import { AddFollowUpDto, CreateLeadDto, UpdateLeadDto } from './dto/lead.dto';

@Injectable()
export class LeadsService {
  constructor(private readonly prisma: PrismaService, private readonly audit: AuditService) {}

  private async partnerIdForUser(userId: string) {
    const p = await this.prisma.partnerProfile.findUnique({ where: { userId } });
    if (!p) throw new ForbiddenException('Partner profile missing');
    return p.id;
  }

  async create(userId: string, dto: CreateLeadDto) {
    const partnerId = await this.partnerIdForUser(userId);
    const lead = await this.prisma.lead.create({
      data: {
        partnerId,
        createdById: userId,
        customerName: dto.customerName,
        customerMobile: dto.customerMobile,
        customerEmail: dto.customerEmail,
        loanType: dto.loanType,
        amountRequested: dto.amountRequested,
        productId: dto.productId,
        city: dto.city,
        notes: dto.notes,
        createdBy: userId,
        updatedBy: userId,
      },
    });
    await this.audit.record({
      actorId: userId, action: 'LEAD_CREATED', entityType: 'Lead', entityId: lead.id,
    });
    return lead;
  }

  async bulkCreate(userId: string, rows: CreateLeadDto[]) {
    const partnerId = await this.partnerIdForUser(userId);
    if (!Array.isArray(rows) || rows.length === 0) throw new BadRequestException('No rows provided');
    if (rows.length > 2000) throw new BadRequestException('Max 2000 rows per upload');
    const created = await this.prisma.$transaction(
      rows.map((r) =>
        this.prisma.lead.create({
          data: {
            partnerId,
            createdById: userId,
            customerName: r.customerName,
            customerMobile: r.customerMobile,
            customerEmail: r.customerEmail,
            loanType: r.loanType,
            amountRequested: r.amountRequested,
            productId: r.productId,
            city: r.city,
            notes: r.notes,
            createdBy: userId,
            updatedBy: userId,
          },
        }),
      ),
    );
    return { count: created.length };
  }

  async list(actorId: string, actorRole: Role, q: { page?: number; pageSize?: number; status?: LeadStatus; search?: string; sort?: string }) {
    const { skip, take, page, pageSize } = paginate(q.page, q.pageSize);
    const where: any = { deletedAt: null };
    if (actorRole === Role.PARTNER) where.partnerId = await this.partnerIdForUser(actorId);
    if (q.status) where.status = q.status;
    if (q.search)
      where.OR = [
        { customerName: { contains: q.search, mode: 'insensitive' } },
        { customerMobile: { contains: q.search } },
      ];
    const [items, total] = await this.prisma.$transaction([
      this.prisma.lead.findMany({
        where, skip, take,
        orderBy: buildOrderBy(q.sort, ['createdAt', 'status']),
        include: { product: { select: { id: true, name: true, slug: true } } },
      }),
      this.prisma.lead.count({ where }),
    ]);
    return paged(items, total, page, pageSize);
  }

  async update(id: string, actorId: string, actorRole: Role, dto: UpdateLeadDto) {
    const lead = await this.prisma.lead.findUnique({ where: { id } });
    if (!lead) throw new NotFoundException();
    if (actorRole === Role.PARTNER) {
      const mine = await this.partnerIdForUser(actorId);
      if (lead.partnerId !== mine) throw new ForbiddenException();
    }
    return this.prisma.lead.update({
      where: { id }, data: { ...dto, updatedBy: actorId },
    });
  }

  async addFollowUp(id: string, actorId: string, dto: AddFollowUpDto) {
    const lead = await this.prisma.lead.findUnique({ where: { id } });
    if (!lead) throw new NotFoundException();
    return this.prisma.leadFollowUp.create({
      data: { leadId: id, scheduledAt: new Date(dto.scheduledAt), note: dto.note, createdBy: actorId },
    });
  }

  async reassign(id: string, toPartnerId: string, actorId: string) {
    return this.prisma.lead.update({
      where: { id }, data: { partnerId: toPartnerId, updatedBy: actorId },
    });
  }
}
