import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface AuditEvent {
  actorId?: string | null;
  action: string;
  entityType: string;
  entityId?: string | null;
  metadata?: Record<string, any>;
  ip?: string;
  userAgent?: string;
}

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);
  constructor(private readonly prisma: PrismaService) {}

  async record(event: AuditEvent) {
    try {
      await this.prisma.auditLog.create({
        data: {
          actorId: event.actorId ?? null,
          action: event.action,
          entityType: event.entityType,
          entityId: event.entityId ?? null,
          metadata: (event.metadata ?? {}) as any,
          ip: event.ip,
          userAgent: event.userAgent,
        },
      });
    } catch (e: any) {
      this.logger.warn(`audit write failed: ${e.message}`);
    }
  }
}
