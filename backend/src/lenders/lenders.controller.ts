import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles, Public } from '../common/decorators/roles.decorator';
import { CurrentUser, AuthUser } from '../common/decorators/current-user.decorator';
import { PaginationQueryDto } from '../common/dto/pagination.dto';
import { LendersService } from './lenders.service';
import { UpsertLenderDto } from './dto/lender.dto';

@ApiTags('Lenders')
@Controller('lenders')
export class LendersController {
  constructor(private readonly svc: LendersService) {}

  @Public() @Get()
  list(@Query() q: PaginationQueryDto & { active?: string }) {
    return this.svc.list(q);
  }

  @ApiBearerAuth('access-token') @UseGuards(JwtAuthGuard, RolesGuard) @Roles(Role.ADMIN) @Post()
  create(@Body() dto: UpsertLenderDto, @CurrentUser() a: AuthUser) {
    return this.svc.create(dto, a.sub);
  }

  @ApiBearerAuth('access-token') @UseGuards(JwtAuthGuard, RolesGuard) @Roles(Role.ADMIN) @Patch(':id')
  update(@Param('id') id: string, @Body() dto: Partial<UpsertLenderDto>, @CurrentUser() a: AuthUser) {
    return this.svc.update(id, dto, a.sub);
  }

  @ApiBearerAuth('access-token') @UseGuards(JwtAuthGuard, RolesGuard) @Roles(Role.ADMIN) @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() a: AuthUser) {
    return this.svc.remove(id, a.sub);
  }
}
