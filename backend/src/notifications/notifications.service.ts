import { Injectable, Logger } from '@nestjs/common';
import { NotificationChannel, NotificationStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

export interface SendNotificationInput {
  userId: string;
  channel: NotificationChannel;
  title: string;
  body: string;
  templateCode?: string;
  metadata?: Record<string, any>;
}

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);
  constructor(private readonly prisma: PrismaService) {}

  async send(input: SendNotificationInput) {
    const notif = await this.prisma.notification.create({
      data: {
        userId: input.userId,
        channel: input.channel,
        templateCode: input.templateCode,
        title: input.title,
        body: input.body,
        metadata: (input.metadata ?? {}) as any,
        status: input.channel === 'IN_APP' ? 'SENT' : 'PENDING',
      },
    });
    // MOCKED: external SMS/Email providers stubbed until keys provided.
    if (input.channel !== 'IN_APP') {
      this.logger.log(`[notif:${input.channel}] → user=${input.userId} "${input.title}" (MOCK)`);
      await this.prisma.notification.update({
        where: { id: notif.id },
        data: { status: NotificationStatus.SENT },
      });
    }
    return notif;
  }

  async listForUser(userId: string, unreadOnly = false) {
    const items = await this.prisma.notification.findMany({
      where: { userId, ...(unreadOnly ? { readAt: null } : {}) },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
    return { items, total: items.length, page: 1, pageSize: items.length };
  }

  async markRead(userId: string, id: string) {
    return this.prisma.notification.updateMany({
      where: { id, userId },
      data: { readAt: new Date(), status: NotificationStatus.READ },
    });
  }

  async markAllRead(userId: string) {
    return this.prisma.notification.updateMany({
      where: { userId, readAt: null },
      data: { readAt: new Date(), status: NotificationStatus.READ },
    });
  }
}
