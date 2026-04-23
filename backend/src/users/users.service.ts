import { Injectable, NotFoundException } from '@nestjs/common';
import { Role } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { buildOrderBy, paged, paginate } from '../common/dto/pagination.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { customerProfile: true, partnerProfile: true },
    });
    if (!user) throw new NotFoundException();
    const { passwordHash, ...safe } = user as any;
    return safe;
  }

  async list(query: { page?: number; pageSize?: number; search?: string; role?: Role; sort?: string }) {
    const { skip, take, page, pageSize } = paginate(query.page, query.pageSize);
    const where: any = { deletedAt: null };
    if (query.role) where.role = query.role;
    if (query.search)
      where.OR = [
        { email: { contains: query.search, mode: 'insensitive' } },
        { mobile: { contains: query.search } },
      ];
    const [items, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        where,
        skip,
        take,
        orderBy: buildOrderBy(query.sort, ['createdAt', 'email']),
        select: {
          id: true, email: true, mobile: true, role: true, isActive: true,
          lastLoginAt: true, createdAt: true,
        },
      }),
      this.prisma.user.count({ where }),
    ]);
    return paged(items, total, page, pageSize);
  }

  async setActive(id: string, isActive: boolean, actorId: string) {
    await this.prisma.user.update({ where: { id }, data: { isActive, updatedBy: actorId } });
    return { id, isActive };
  }
}
