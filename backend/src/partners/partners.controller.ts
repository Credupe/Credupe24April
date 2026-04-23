import { Body, Controller, Get, Param, Patch, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { KycStatus, Role } from '@prisma/client';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser, AuthUser } from '../common/decorators/current-user.decorator';
import { PaginationQueryDto } from '../common/dto/pagination.dto';
import { PartnersService } from './partners.service';
import { SetKycStatusDto, UpsertPartnerProfileDto } from './dto/partner.dto';

@ApiTags('Partners')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('partners')
export class PartnersController {
  constructor(private readonly svc: PartnersService) {}

  @Roles(Role.PARTNER) @Get('me')
  mine(@CurrentUser() u: AuthUser) { return this.svc.getMine(u.sub); }

  @Roles(Role.PARTNER) @Put('me')
  upsert(@CurrentUser() u: AuthUser, @Body() dto: UpsertPartnerProfileDto) { return this.svc.upsertMine(u.sub, dto); }

  @Roles(Role.PARTNER) @Patch('me')
  patch(@CurrentUser() u: AuthUser, @Body() dto: UpsertPartnerProfileDto) { return this.svc.upsertMine(u.sub, dto); }

  @Roles(Role.ADMIN) @Get()
  list(@Query() q: PaginationQueryDto & { kycStatus?: KycStatus }) { return this.svc.list(q); }

  @Roles(Role.ADMIN) @Patch(':id/kyc')
  setKyc(@Param('id') id: string, @Body() dto: SetKycStatusDto, @CurrentUser() a: AuthUser) {
    return this.svc.setKyc(id, dto.kycStatus, a.sub);
  }
}
