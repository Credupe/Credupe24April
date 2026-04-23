import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LeadStatus, Role } from '@prisma/client';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser, AuthUser } from '../common/decorators/current-user.decorator';
import { PaginationQueryDto } from '../common/dto/pagination.dto';
import { LeadsService } from './leads.service';
import { AddFollowUpDto, CreateLeadDto, UpdateLeadDto } from './dto/lead.dto';

@ApiTags('Leads')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('leads')
export class LeadsController {
  constructor(private readonly svc: LeadsService) {}

  @Roles(Role.PARTNER) @Post()
  create(@CurrentUser() u: AuthUser, @Body() dto: CreateLeadDto) {
    return this.svc.create(u.sub, dto);
  }

  @Roles(Role.PARTNER) @Post('bulk')
  bulk(@CurrentUser() u: AuthUser, @Body() body: { rows: CreateLeadDto[] }) {
    return this.svc.bulkCreate(u.sub, body.rows);
  }

  @Roles(Role.PARTNER, Role.ADMIN) @Get()
  list(@CurrentUser() u: AuthUser, @Query() q: PaginationQueryDto & { status?: LeadStatus }) {
    return this.svc.list(u.sub, u.role as Role, q);
  }

  @Roles(Role.PARTNER, Role.ADMIN) @Patch(':id')
  update(@Param('id') id: string, @CurrentUser() u: AuthUser, @Body() dto: UpdateLeadDto) {
    return this.svc.update(id, u.sub, u.role as Role, dto);
  }

  @Roles(Role.PARTNER, Role.ADMIN) @Post(':id/follow-ups')
  followUp(@Param('id') id: string, @CurrentUser() u: AuthUser, @Body() dto: AddFollowUpDto) {
    return this.svc.addFollowUp(id, u.sub, dto);
  }

  @Roles(Role.ADMIN) @Post(':id/reassign')
  reassign(@Param('id') id: string, @Body() body: { partnerId: string }, @CurrentUser() u: AuthUser) {
    return this.svc.reassign(id, body.partnerId, u.sub);
  }
}
