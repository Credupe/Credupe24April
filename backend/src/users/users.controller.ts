import { Body, Controller, Get, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser, AuthUser } from '../common/decorators/current-user.decorator';
import { PaginationQueryDto } from '../common/dto/pagination.dto';
import { UsersService } from './users.service';

@ApiTags('Users')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly svc: UsersService) {}

  @Get('me')
  me(@CurrentUser() user: AuthUser) {
    return this.svc.findMe(user.sub);
  }

  @Roles(Role.ADMIN) @Get()
  list(@Query() q: PaginationQueryDto & { role?: Role }) {
    return this.svc.list(q);
  }

  @Roles(Role.ADMIN) @Patch(':id/active')
  setActive(
    @Param('id') id: string,
    @Body() body: { isActive: boolean },
    @CurrentUser() actor: AuthUser,
  ) {
    return this.svc.setActive(id, !!body.isActive, actor.sub);
  }
}
