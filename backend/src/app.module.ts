import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { LoggerModule } from 'nestjs-pino';
import { PrismaModule } from './prisma/prisma.module';
import { RedisModule } from './redis/redis.module';
import { StorageModule } from './storage/storage.module';
import { AuditModule } from './audit/audit.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CustomersModule } from './customers/customers.module';
import { PartnersModule } from './partners/partners.module';
import { LendersModule } from './lenders/lenders.module';
import { LoanProductsModule } from './loan-products/loan-products.module';
import { LoanApplicationsModule } from './loan-applications/loan-applications.module';
import { LeadsModule } from './leads/leads.module';
import { DocumentsModule } from './documents/documents.module';
import { NotificationsModule } from './notifications/notifications.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { HealthModule } from './health/health.module';
import { QuotesModule } from './quotes/quotes.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, cache: true }),
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.LOG_LEVEL || 'info',
        transport:
          process.env.NODE_ENV === 'production'
            ? undefined
            : { target: 'pino-pretty', options: { singleLine: true, colorize: true } },
        redact: ['req.headers.authorization', 'req.headers.cookie'],
      },
    }),
    ThrottlerModule.forRoot([
      {
        ttl: Number(process.env.THROTTLE_TTL_SECONDS || 60) * 1000,
        limit: Number(process.env.THROTTLE_LIMIT || 120),
      },
    ]),
    PrismaModule,
    RedisModule,
    StorageModule,
    AuditModule,
    AuthModule,
    UsersModule,
    CustomersModule,
    PartnersModule,
    LendersModule,
    LoanProductsModule,
    LoanApplicationsModule,
    LeadsModule,
    DocumentsModule,
    NotificationsModule,
    AnalyticsModule,
    HealthModule,
    QuotesModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
