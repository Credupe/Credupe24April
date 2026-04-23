import { Body, Controller, Get, Headers, HttpCode, HttpStatus, Ip, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Public } from '../common/decorators/roles.decorator';
import { CurrentUser, AuthUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { AuthService } from './auth.service';
import { LoginDto, OtpRequestDto, OtpVerifyDto, RefreshTokenDto, RegisterDto } from './dto/auth.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Public() @Post('register') @HttpCode(HttpStatus.CREATED)
  register(@Body() dto: RegisterDto, @Ip() ip: string, @Headers('user-agent') ua: string) {
    return this.auth.register(dto, { ip, userAgent: ua });
  }

  @Public() @Post('login') @HttpCode(HttpStatus.OK)
  login(@Body() dto: LoginDto, @Ip() ip: string, @Headers('user-agent') ua: string) {
    return this.auth.login(dto, { ip, userAgent: ua });
  }

  @Public() @Post('refresh') @HttpCode(HttpStatus.OK)
  refresh(@Body() dto: RefreshTokenDto, @Ip() ip: string, @Headers('user-agent') ua: string) {
    return this.auth.refresh(dto, { ip, userAgent: ua });
  }

  @Public() @Post('otp/request') @HttpCode(HttpStatus.OK)
  requestOtp(@Body() dto: OtpRequestDto) {
    return this.auth.requestOtp(dto);
  }

  @Public() @Post('otp/verify') @HttpCode(HttpStatus.OK)
  verifyOtp(@Body() dto: OtpVerifyDto, @Ip() ip: string, @Headers('user-agent') ua: string) {
    return this.auth.verifyOtp(dto, { ip, userAgent: ua });
  }

  @ApiBearerAuth('access-token') @UseGuards(JwtAuthGuard) @Post('logout') @HttpCode(HttpStatus.OK)
  logout(@CurrentUser() user: AuthUser, @Body() body: { refreshToken?: string }) {
    return this.auth.logout(user.sub, body?.refreshToken);
  }

  @ApiBearerAuth('access-token') @UseGuards(JwtAuthGuard) @Get('me')
  me(@CurrentUser() user: AuthUser) {
    return user;
  }
}
