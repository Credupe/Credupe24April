import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Public, Roles } from '../common/decorators/roles.decorator';
import { CurrentUser, AuthUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { QuotesService } from './quotes.service';
import { ConvertQuoteDto, CreateQuoteDto } from './dto/quote.dto';

@ApiTags('Quotes')
@Controller('quotes')
export class QuotesController {
  constructor(private readonly svc: QuotesService) {}

  /** Public instant-offer endpoint — no auth required. Binds to user if JWT is provided. */
  @Public() @Post()
  create(@Body() dto: CreateQuoteDto, @Req() req: any) {
    const userId = req?.user?.sub as string | undefined;
    return this.svc.create(dto, userId);
  }

  @Public() @Get(':id')
  get(@Param('id') id: string) {
    return this.svc.getById(id);
  }

  @Public() @Get('s/:slug')
  getShared(@Param('slug') slug: string) {
    return this.svc.getBySlug(slug);
  }

  @ApiBearerAuth('access-token') @UseGuards(JwtAuthGuard, RolesGuard) @Roles(Role.CUSTOMER) @Post(':id/apply')
  apply(@Param('id') id: string, @CurrentUser() u: AuthUser, @Body() dto: ConvertQuoteDto) {
    return this.svc.convertToApplication(id, u.sub, dto);
  }

  @Public() @Post(':id/share')
  share(@Param('id') id: string) {
    return this.svc.createShare(id);
  }
}
