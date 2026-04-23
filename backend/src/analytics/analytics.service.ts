import { Injectable } from '@nestjs/common';
import { ApplicationStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async funnel() {
    // Aggregate by status bucket — maps loan lifecycle into funnel stages.
    const rows = await this.prisma.loanApplication.groupBy({
      by: ['status'],
      where: { deletedAt: null },
      _count: { _all: true },
    });
    const byStatus = Object.fromEntries(rows.map((r) => [r.status, r._count._all])) as Record<ApplicationStatus, number>;
    const total = rows.reduce((a, r) => a + r._count._all, 0);
    return {
      total,
      byStatus,
      funnel: {
        LEAD: byStatus.LEAD || 0,
        LOGIN: byStatus.LOGIN || 0,
        DOC_PENDING: byStatus.DOC_PENDING || 0,
        UNDER_REVIEW: byStatus.UNDER_REVIEW || 0,
        APPROVED: byStatus.APPROVED || 0,
        DISBURSED: byStatus.DISBURSED || 0,
        REJECTED: byStatus.REJECTED || 0,
        CANCELLED: byStatus.CANCELLED || 0,
      },
    };
  }

  async partnerSummary(partnerId: string) {
    const leads = await this.prisma.lead.groupBy({
      by: ['status'], where: { partnerId, deletedAt: null }, _count: { _all: true },
    });
    const commissions = await this.prisma.commission.aggregate({
      where: { partnerId }, _sum: { amount: true },
    });
    return {
      leadsByStatus: Object.fromEntries(leads.map((r) => [r.status, r._count._all])),
      totalCommissions: commissions._sum.amount ?? 0,
    };
  }
}
