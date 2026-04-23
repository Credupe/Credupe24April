import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { ApplicationStatus, Role, NotificationChannel } from '@prisma/client';
import { randomBytes } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { buildOrderBy, paged, paginate } from '../common/dto/pagination.dto';
import { NotificationsService } from '../notifications/notifications.service';
import { AuditService } from '../audit/audit.service';
import {
  CreateLoanApplicationDto,
  TransitionApplicationDto,
  UpdateLoanApplicationDto,
} from './dto/loan-application.dto';
import { canTransition, nextAllowed } from './state-machine';

@Injectable()
export class LoanApplicationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notif: NotificationsService,
    private readonly audit: AuditService,
  ) {}

  private makeRef() {
    return `CRD-${Date.now().toString(36).toUpperCase()}-${randomBytes(3).toString('hex').toUpperCase()}`;
  }

  async create(userId: string, dto: CreateLoanApplicationDto) {
    let lenderId: string | undefined;
    if (dto.productId) {
      const p = await this.prisma.loanProduct.findUnique({ where: { id: dto.productId } });
      if (!p) throw new BadRequestException('Unknown productId');
      lenderId = p.lenderId;
    }
    const app = await this.prisma.loanApplication.create({
      data: {
        referenceNo: this.makeRef(),
        userId,
        productId: dto.productId,
        lenderId,
        loanType: dto.loanType,
        amountRequested: dto.amountRequested,
        tenureMonths: dto.tenureMonths,
        purpose: dto.purpose,
        formData: (dto.formData ?? {}) as any,
        status: ApplicationStatus.LEAD,
        createdBy: userId,
        updatedBy: userId,
        statusHistory: {
          create: { toStatus: ApplicationStatus.LEAD, changedBy: userId, note: 'Application created' },
        },
      },
    });
    await this.audit.record({
      actorId: userId, action: 'APPLICATION_CREATED',
      entityType: 'LoanApplication', entityId: app.id,
      metadata: { loanType: app.loanType, amount: app.amountRequested },
    });
    return app;
  }

  async update(id: string, userId: string, dto: UpdateLoanApplicationDto) {
    const app = await this.prisma.loanApplication.findUnique({ where: { id } });
    if (!app) throw new NotFoundException();
    if (app.userId !== userId) throw new ForbiddenException();
    if (['DISBURSED', 'REJECTED', 'CANCELLED'].includes(app.status)) {
      throw new BadRequestException('Application is locked in its current status');
    }
    return this.prisma.loanApplication.update({
      where: { id },
      data: {
        ...dto,
        formData: dto.formData ? (dto.formData as any) : undefined,
        updatedBy: userId,
      },
    });
  }

  async listForUser(userId: string, q: { page?: number; pageSize?: number; status?: ApplicationStatus; sort?: string }) {
    const { skip, take, page, pageSize } = paginate(q.page, q.pageSize);
    const where: any = { userId, deletedAt: null };
    if (q.status) where.status = q.status;
    const [items, total] = await this.prisma.$transaction([
      this.prisma.loanApplication.findMany({
        where, skip, take, orderBy: buildOrderBy(q.sort, ['createdAt', 'status']),
        include: {
          lender: { select: { id: true, name: true, slug: true, logoUrl: true } },
          product: { select: { id: true, name: true, slug: true, loanType: true } },
        },
      }),
      this.prisma.loanApplication.count({ where }),
    ]);
    return paged(items, total, page, pageSize);
  }

  async listForAdmin(q: { page?: number; pageSize?: number; status?: ApplicationStatus; search?: string; sort?: string }) {
    const { skip, take, page, pageSize } = paginate(q.page, q.pageSize);
    const where: any = { deletedAt: null };
    if (q.status) where.status = q.status;
    if (q.search) where.referenceNo = { contains: q.search, mode: 'insensitive' };
    const [items, total] = await this.prisma.$transaction([
      this.prisma.loanApplication.findMany({
        where, skip, take, orderBy: buildOrderBy(q.sort, ['createdAt', 'status']),
        include: {
          user: { select: { id: true, email: true, mobile: true } },
          lender: { select: { id: true, name: true, slug: true } },
          product: { select: { id: true, name: true } },
        },
      }),
      this.prisma.loanApplication.count({ where }),
    ]);
    return paged(items, total, page, pageSize);
  }

  async getById(id: string, actorId: string, actorRole: Role) {
    const app = await this.prisma.loanApplication.findUnique({
      where: { id },
      include: {
        lender: true, product: true, documents: true,
        statusHistory: { orderBy: { createdAt: 'asc' } },
      },
    });
    if (!app) throw new NotFoundException();
    if (actorRole !== Role.ADMIN && app.userId !== actorId) throw new ForbiddenException();
    return app;
  }

  async transition(id: string, actorId: string, actorRole: Role, dto: TransitionApplicationDto) {
    const app = await this.prisma.loanApplication.findUnique({ where: { id } });
    if (!app) throw new NotFoundException();

    // Customers can only CANCEL. Admins can drive any valid transition.
    if (actorRole === Role.CUSTOMER) {
      if (app.userId !== actorId) throw new ForbiddenException();
      if (dto.toStatus !== ApplicationStatus.CANCELLED) {
        throw new ForbiddenException('Customers may only cancel applications');
      }
    }
    if (!canTransition(app.status, dto.toStatus)) {
      throw new BadRequestException(
        `Illegal transition ${app.status} → ${dto.toStatus}. Allowed: [${nextAllowed(app.status).join(', ') || 'none'}]`,
      );
    }

    const updated = await this.prisma.$transaction(async (tx) => {
      const next = await tx.loanApplication.update({
        where: { id },
        data: {
          status: dto.toStatus,
          rejectionReason: dto.rejectionReason,
          approvedAmount: dto.approvedAmount,
          approvedTenure: dto.approvedTenure,
          approvedRate: dto.approvedRate,
          disbursedAt: dto.toStatus === ApplicationStatus.DISBURSED ? new Date() : undefined,
          updatedBy: actorId,
        },
      });
      await tx.applicationStatusHistory.create({
        data: {
          applicationId: id, fromStatus: app.status, toStatus: dto.toStatus,
          note: dto.note, changedBy: actorId,
        },
      });
      return next;
    });

    await this.notif.send({
      userId: app.userId,
      channel: NotificationChannel.IN_APP,
      title: `Your application ${app.referenceNo} is now ${dto.toStatus}`,
      body: dto.note || `Status updated to ${dto.toStatus}`,
      templateCode: 'APPLICATION_STATUS_CHANGED',
      metadata: { applicationId: app.id, toStatus: dto.toStatus },
    });
    await this.audit.record({
      actorId, action: 'APPLICATION_TRANSITIONED',
      entityType: 'LoanApplication', entityId: app.id,
      metadata: { from: app.status, to: dto.toStatus, note: dto.note },
    });
    return updated;
  }
}
