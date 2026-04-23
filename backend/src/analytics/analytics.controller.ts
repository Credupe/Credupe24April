import { Controller, ForbiddenException, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser, AuthUser } from '../common/decorators/current-user.decorator';
import { PrismaService } from '../prisma/prisma.service';
import { AnalyticsService } from './analytics.service';

@ApiTags('Analytics')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly svc: AnalyticsService, private readonly prisma: PrismaService) {}

  @Roles(Role.ADMIN) @Get('admin/funnel')
  adminFunnel() { return this.svc.funnel(); }

  @Roles(Role.PARTNER) @Get('partner/summary')
  async partnerSummary(@CurrentUser() u: AuthUser) {
    const partner = await this.prisma.partnerProfile.findUnique({ where: { userId: u.sub } });
    if (!partner) throw new ForbiddenException();
    return this.svc.partnerSummary(partner.id);
  }
}
