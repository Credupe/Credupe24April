import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpsertCustomerProfileDto } from './dto/customer.dto';

@Injectable()
export class CustomersService {
  constructor(private readonly prisma: PrismaService) {}

  async getMine(userId: string) {
    const profile = await this.prisma.customerProfile.findUnique({ where: { userId } });
    if (!profile) {
      return this.prisma.customerProfile.create({ data: { userId } });
    }
    return profile;
  }

  async upsertMine(userId: string, dto: UpsertCustomerProfileDto) {
    // Mask sensitive fields — never persist full PAN/Aadhaar
    const panLast4 = dto.pan ? dto.pan.slice(-4) : undefined;
    const aadhaarLast4 = dto.aadhaar ? dto.aadhaar.slice(-4) : undefined;
    const { pan, aadhaar, ...rest } = dto;

    const data = {
      ...rest,
      ...(panLast4 ? { panLast4 } : {}),
      ...(aadhaarLast4 ? { aadhaarLast4 } : {}),
      updatedBy: userId,
    };
    return this.prisma.customerProfile.upsert({
      where: { userId },
      create: { userId, ...data, createdBy: userId },
      update: data,
    });
  }

  async getById(id: string) {
    const p = await this.prisma.customerProfile.findUnique({
      where: { id },
      include: { user: { select: { id: true, email: true, mobile: true, role: true } } },
    });
    if (!p) throw new NotFoundException();
    return p;
  }
}
