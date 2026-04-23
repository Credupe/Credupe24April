import {
  Body, Controller, Get, Param, Patch, Post, Query, UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ApplicationStatus, Role } from '@prisma/client';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser, AuthUser } from '../common/decorators/current-user.decorator';
import { PaginationQueryDto } from '../common/dto/pagination.dto';
import { LoanApplicationsService } from './loan-applications.service';
import {
  CreateLoanApplicationDto, TransitionApplicationDto, UpdateLoanApplicationDto,
} from './dto/loan-application.dto';

@ApiTags('Loan Applications')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('loan-applications')
export class LoanApplicationsController {
  constructor(private readonly svc: LoanApplicationsService) {}

  @Roles(Role.CUSTOMER) @Post()
  create(@CurrentUser() u: AuthUser, @Body() dto: CreateLoanApplicationDto) {
    return this.svc.create(u.sub, dto);
  }

  @Roles(Role.CUSTOMER) @Get('mine')
  mine(
    @CurrentUser() u: AuthUser,
    @Query() q: PaginationQueryDto & { status?: ApplicationStatus },
  ) {
    return this.svc.listForUser(u.sub, q);
  }

  @Roles(Role.ADMIN) @Get()
  listAdmin(@Query() q: PaginationQueryDto & { status?: ApplicationStatus }) {
    return this.svc.listForAdmin(q);
  }

  @Get(':id')
  getOne(@Param('id') id: string, @CurrentUser() u: AuthUser) {
    return this.svc.getById(id, u.sub, u.role as Role);
  }

  @Roles(Role.CUSTOMER) @Patch(':id')
  update(@Param('id') id: string, @CurrentUser() u: AuthUser, @Body() dto: UpdateLoanApplicationDto) {
    return this.svc.update(id, u.sub, dto);
  }

  @Roles(Role.CUSTOMER, Role.ADMIN) @Post(':id/transition')
  transition(
    @Param('id') id: string,
    @CurrentUser() u: AuthUser,
    @Body() dto: TransitionApplicationDto,
  ) {
    return this.svc.transition(id, u.sub, u.role as Role, dto);
  }
}
