import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { createHash, randomBytes, randomInt } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { NotificationsService } from '../notifications/notifications.service';
import { LoginDto, OtpRequestDto, OtpVerifyDto, RefreshTokenDto, RegisterDto } from './dto/auth.dto';

interface AuthContext {
  ip?: string;
  userAgent?: string;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly audit: AuditService,
    private readonly notif: NotificationsService,
  ) {}

  // ─── Registration ─────────────────────────────────────────────────────────
  async register(dto: RegisterDto, ctx: AuthContext) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) throw new ConflictException('Email already registered');

    const salt = Number(process.env.BCRYPT_SALT_ROUNDS || 10);
    const passwordHash = await bcrypt.hash(dto.password, salt);
    const role = dto.role ?? Role.CUSTOMER;

    if (role === Role.ADMIN) {
      throw new BadRequestException('Admin accounts cannot self-register');
    }
    if (role === Role.PARTNER && !dto.businessName) {
      throw new BadRequestException('businessName is required for partner registration');
    }

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        mobile: dto.mobile,
        passwordHash,
        role,
        ...(role === Role.CUSTOMER
          ? {
              customerProfile: {
                create: { firstName: dto.firstName, lastName: dto.lastName },
              },
            }
          : {}),
        ...(role === Role.PARTNER
          ? {
              partnerProfile: {
                create: { businessName: dto.businessName!, contactPerson: [dto.firstName, dto.lastName].filter(Boolean).join(' ') || null },
              },
            }
          : {}),
      },
    });

    await this.audit.record({
      actorId: user.id,
      action: 'USER_REGISTERED',
      entityType: 'User',
      entityId: user.id,
      metadata: { role },
      ip: ctx.ip,
      userAgent: ctx.userAgent,
    });

    return this.issueTokens(user.id, user.email, user.role, ctx);
  }

  // ─── Password login ───────────────────────────────────────────────────────
  async login(dto: LoginDto, ctx: AuthContext) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user || !user.passwordHash || !user.isActive) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const ok = await bcrypt.compare(dto.password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('Invalid credentials');

    await this.prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
    await this.audit.record({
      actorId: user.id,
      action: 'USER_LOGIN',
      entityType: 'User',
      entityId: user.id,
      ip: ctx.ip,
      userAgent: ctx.userAgent,
    });
    return this.issueTokens(user.id, user.email, user.role, ctx);
  }

  // ─── Token rotation ───────────────────────────────────────────────────────
  async refresh(dto: RefreshTokenDto, ctx: AuthContext) {
    const hash = this.hashToken(dto.refreshToken);
    const row = await this.prisma.refreshToken.findUnique({ where: { tokenHash: hash } });
    if (!row || row.revokedAt || row.expiresAt < new Date()) {
      throw new UnauthorizedException('Refresh token invalid or expired');
    }
    const user = await this.prisma.user.findUnique({ where: { id: row.userId } });
    if (!user || !user.isActive) throw new UnauthorizedException('User disabled');

    // rotate: revoke current, issue new
    await this.prisma.refreshToken.update({
      where: { id: row.id },
      data: { revokedAt: new Date() },
    });
    return this.issueTokens(user.id, user.email, user.role, ctx);
  }

  async logout(userId: string, refreshToken?: string) {
    if (refreshToken) {
      const hash = this.hashToken(refreshToken);
      await this.prisma.refreshToken.updateMany({
        where: { userId, tokenHash: hash, revokedAt: null },
        data: { revokedAt: new Date() },
      });
    } else {
      await this.prisma.refreshToken.updateMany({
        where: { userId, revokedAt: null },
        data: { revokedAt: new Date() },
      });
    }
    return { ok: true };
  }

  // ─── OTP (mobile) ─────────────────────────────────────────────────────────
  async requestOtp(dto: OtpRequestDto) {
    const code = String(randomInt(0, 1000000)).padStart(6, '0');
    const codeHash = this.hashToken(code);
    await this.prisma.otpCode.create({
      data: {
        channel: 'mobile',
        destination: dto.destination,
        codeHash,
        purpose: dto.purpose || 'login',
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      },
    });
    // MOCKED: real SMS send replaced with in-memory delivery.
    // In development we return the OTP so the frontend QA flow works without a provider.
    const devExposeOtp = (process.env.NODE_ENV || 'development') !== 'production';
    this.logger.log(`[otp] dest=${dto.destination} code=${code} (mock)`);
    return {
      destination: dto.destination,
      expiresInSec: 300,
      ...(devExposeOtp ? { devOtp: code } : {}),
    };
  }

  async verifyOtp(dto: OtpVerifyDto, ctx: AuthContext) {
    const row = await this.prisma.otpCode.findFirst({
      where: {
        destination: dto.destination,
        purpose: dto.purpose || 'login',
        consumedAt: null,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });
    if (!row) throw new UnauthorizedException('No valid OTP — request a new code');
    if (row.attempts >= 5) throw new UnauthorizedException('Too many attempts');

    const ok = row.codeHash === this.hashToken(dto.code);
    await this.prisma.otpCode.update({
      where: { id: row.id },
      data: { attempts: { increment: 1 }, consumedAt: ok ? new Date() : null },
    });
    if (!ok) throw new UnauthorizedException('Incorrect OTP');

    // Ensure user exists (mobile-first signup)
    let user = await this.prisma.user.findFirst({ where: { mobile: dto.destination } });
    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email: `m-${dto.destination.replace(/\D/g, '')}@otp.local`,
          mobile: dto.destination,
          role: Role.CUSTOMER,
          customerProfile: { create: {} },
        },
      });
    }
    return this.issueTokens(user.id, user.email, user.role, ctx);
  }

  // ─── Internal helpers ─────────────────────────────────────────────────────
  private async issueTokens(userId: string, email: string, role: Role, ctx: AuthContext) {
    const payload = { sub: userId, email, role };
    const accessToken = this.jwt.sign(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: Number(process.env.JWT_ACCESS_TTL || 900),
    });
    const refreshTTL = Number(process.env.JWT_REFRESH_TTL || 2592000);
    const refreshRaw = randomBytes(48).toString('base64url');
    const refreshToken = this.jwt.sign(
      { sub: userId, jti: refreshRaw },
      { secret: process.env.JWT_REFRESH_SECRET, expiresIn: refreshTTL },
    );
    await this.prisma.refreshToken.create({
      data: {
        userId,
        tokenHash: this.hashToken(refreshToken),
        expiresAt: new Date(Date.now() + refreshTTL * 1000),
        ip: ctx.ip,
        userAgent: ctx.userAgent,
      },
    });
    return {
      accessToken,
      refreshToken,
      expiresIn: Number(process.env.JWT_ACCESS_TTL || 900),
      user: { id: userId, email, role },
    };
  }

  private hashToken(raw: string) {
    return createHash('sha256').update(raw).digest('hex');
  }
}
