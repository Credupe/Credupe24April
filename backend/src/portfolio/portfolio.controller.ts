import {
  Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Public } from '../common/decorators/roles.decorator';
import { CurrentUser, AuthUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PortfolioService } from './portfolio.service';

class ApplyBalanceTransferDto {
  @IsOptional() @IsString() targetLender?: string;
  @IsOptional() @Type(() => Number) @IsNumber() targetRatePct?: number;
  @IsOptional() @Type(() => Number) @IsNumber() expectedMonthlySaving?: number;
  @IsOptional() @Type(() => Number) @IsNumber() expectedLifetimeSaving?: number;
  @IsOptional() @IsString() productId?: string;
}

@ApiTags('Portfolio')
@Controller('portfolio')
export class PortfolioController {
  constructor(private readonly svc: PortfolioService) {}

  // ── User's own portfolio (auth required) ─────────────────────────────
  @ApiBearerAuth('access-token') @UseGuards(JwtAuthGuard) @Get('me')
  me(@CurrentUser() u: AuthUser) {
    return this.svc.getPortfolio(u.sub);
  }

  // ── Demo portfolio for anonymous / non-logged-in visitors ────────────
  // Returns Mr. Sharma's static scenario so the marketing pages stay
  // populated even without auth. Logged-in users get their real data
  // from /me above.
  @Public() @Get('demo')
  demo() {
    return this.svc.getDemoPortfolio();
  }

  // ── Sahamati AA consent flow ─────────────────────────────────────────
  @ApiBearerAuth('access-token') @UseGuards(JwtAuthGuard) @Post('aa/consent')
  @HttpCode(HttpStatus.CREATED)
  requestConsent(@CurrentUser() u: AuthUser) {
    return this.svc.requestAAConsent(u.sub);
  }

  @ApiBearerAuth('access-token') @UseGuards(JwtAuthGuard) @Get('aa/consent/:handle')
  consentStatus(@CurrentUser() u: AuthUser, @Param('handle') handle: string) {
    return this.svc.getConsentStatus(u.sub, handle);
  }

  @ApiBearerAuth('access-token') @UseGuards(JwtAuthGuard) @Post('aa/consent/:handle/sync')
  syncFromAA(@CurrentUser() u: AuthUser, @Param('handle') handle: string) {
    return this.svc.syncFromAA(u.sub, handle);
  }

  @ApiBearerAuth('access-token') @UseGuards(JwtAuthGuard) @Delete('loans/:id')
  removeLoan(@CurrentUser() u: AuthUser, @Param('id') id: string) {
    return this.svc.removeLoan(u.sub, id);
  }

  // ── 1-click balance transfer: turn an aggregated loan into a refinance
  //    application against a target lender from the AI insight card.
  @ApiBearerAuth('access-token') @UseGuards(JwtAuthGuard)
  @Post('loans/:id/balance-transfer')
  @HttpCode(HttpStatus.CREATED)
  applyBalanceTransfer(
    @CurrentUser() u: AuthUser,
    @Param('id') id: string,
    @Body() dto: ApplyBalanceTransferDto,
  ) {
    return this.svc.applyBalanceTransfer(u.sub, id, dto);
  }
}
