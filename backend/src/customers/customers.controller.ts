import { Body, Controller, Get, Param, Patch, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser, AuthUser } from '../common/decorators/current-user.decorator';
import { CustomersService } from './customers.service';
import { UpsertCustomerProfileDto } from './dto/customer.dto';

@ApiTags('Customer Profile')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('customers')
export class CustomersController {
  constructor(private readonly svc: CustomersService) {}

  @Roles(Role.CUSTOMER) @Get('me')
  getMine(@CurrentUser() user: AuthUser) {
    return this.svc.getMine(user.sub);
  }

  @Roles(Role.CUSTOMER) @Put('me')
  upsertMine(@CurrentUser() user: AuthUser, @Body() dto: UpsertCustomerProfileDto) {
    return this.svc.upsertMine(user.sub, dto);
  }

  @Roles(Role.CUSTOMER) @Patch('me')
  patchMine(@CurrentUser() user: AuthUser, @Body() dto: UpsertCustomerProfileDto) {
    return this.svc.upsertMine(user.sub, dto);
  }

  @Roles(Role.ADMIN) @Get(':id')
  getById(@Param('id') id: string) {
    return this.svc.getById(id);
  }
}
