import {
  Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LoanType, Role } from '@prisma/client';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Public, Roles } from '../common/decorators/roles.decorator';
import { CurrentUser, AuthUser } from '../common/decorators/current-user.decorator';
import { PaginationQueryDto } from '../common/dto/pagination.dto';
import { LoanProductsService } from './loan-products.service';
import { EligibilityQueryDto, UpsertLoanProductDto } from './dto/loan-product.dto';

@ApiTags('Loan Products')
@Controller('loan-products')
export class LoanProductsController {
  constructor(private readonly svc: LoanProductsService) {}

  @Public() @Get()
  list(@Query() q: PaginationQueryDto & { loanType?: LoanType; active?: string }) {
    return this.svc.list(q);
  }

  @Public() @Post('eligibility')
  eligibility(@Body() q: EligibilityQueryDto) {
    return this.svc.matchOffers(q);
  }

  @Public() @Get('slug/:slug')
  bySlug(@Param('slug') slug: string) {
    return this.svc.getBySlug(slug);
  }

  @ApiBearerAuth('access-token') @UseGuards(JwtAuthGuard, RolesGuard) @Roles(Role.ADMIN) @Post()
  create(@Body() dto: UpsertLoanProductDto, @CurrentUser() a: AuthUser) {
    return this.svc.create(dto, a.sub);
  }

  @ApiBearerAuth('access-token') @UseGuards(JwtAuthGuard, RolesGuard) @Roles(Role.ADMIN) @Patch(':id')
  update(@Param('id') id: string, @Body() dto: Partial<UpsertLoanProductDto>, @CurrentUser() a: AuthUser) {
    return this.svc.update(id, dto, a.sub);
  }

  @ApiBearerAuth('access-token') @UseGuards(JwtAuthGuard, RolesGuard) @Roles(Role.ADMIN) @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() a: AuthUser) {
    return this.svc.remove(id, a.sub);
  }
}
