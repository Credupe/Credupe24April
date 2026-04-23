import { Controller, Get, Inject } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../common/decorators/roles.decorator';
import { PrismaService } from '../prisma/prisma.service';
import { REDIS_CLIENT } from '../redis/redis.module';
import type Redis from 'ioredis';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(REDIS_CLIENT) private readonly redis: Redis,
  ) {}

  @Public() @Get()
  async health() {
    const [db, cache] = await Promise.all([
      this.prisma.$queryRaw`SELECT 1`.then(() => 'ok').catch((e) => `down: ${e.message}`),
      this.redis.ping().then(() => 'ok').catch((e: any) => `down: ${e.message}`),
    ]);
    return { status: 'ok', db, cache, uptimeSec: Math.floor(process.uptime()) };
  }
}
