import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role, LoanType } from '@prisma/client';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser, AuthUser } from '../common/decorators/current-user.decorator';
import { EmployeeService } from './employee.service';

@ApiTags('Employee')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.EMPLOYEE, Role.ADMIN)
@Controller('employee')
export class EmployeeController {
  constructor(private readonly svc: EmployeeService) {}

  @Get('me')
  me(@CurrentUser() u: AuthUser) { return this.svc.getMe(u.sub); }

  @Get('leads')
  leads(@CurrentUser() u: AuthUser) { return this.svc.getLeads(u.sub); }

  @Get('applications')
  applications(@CurrentUser() u: AuthUser) { return this.svc.getApplications(u.sub); }

  @Get('performance')
  performance(@CurrentUser() u: AuthUser) { return this.svc.getPerformance(u.sub); }

  @Get('payouts')
  payouts(@CurrentUser() u: AuthUser) { return this.svc.getPayouts(u.sub); }

  @Get('tasks')
  tasks(@CurrentUser() u: AuthUser) { return this.svc.getTasks(u.sub); }

  @Get('announcements')
  announcements(@CurrentUser() u: AuthUser) { return this.svc.getAnnouncements(u.sub); }

  @Get('customer-search')
  customerSearch(@CurrentUser() u: AuthUser, @Query('q') q: string) {
    return this.svc.customerSearch(u.sub, q);
  }

  @Post('quick-apply')
  quickApply(
    @CurrentUser() u: AuthUser,
    @Body() dto: { customerUserId: string; loanType: LoanType; amountRequested: number; tenureMonths: number; purpose?: string; productId?: string },
  ) {
    return this.svc.quickApply(u.sub, dto);
  }
}
