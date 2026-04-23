import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { DocumentTag, Role } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';
import { PresignDocumentDto, RegisterDocumentDto, VerifyDocumentDto } from './dto/document.dto';

@Injectable()
export class DocumentsService {
  constructor(private readonly prisma: PrismaService, private readonly storage: StorageService) {}

  async presign(userId: string, dto: PresignDocumentDto) {
    return this.storage.presignUpload({
      ownerUserId: userId,
      fileName: dto.fileName,
      mimeType: dto.mimeType,
    });
  }

  async register(userId: string, dto: RegisterDocumentDto) {
    return this.prisma.document.create({
      data: {
        ownerUserId: userId,
        applicationId: dto.applicationId,
        tag: dto.tag ?? DocumentTag.OTHER,
        fileName: dto.fileName,
        mimeType: dto.mimeType,
        sizeBytes: dto.sizeBytes,
        storageKey: dto.storageKey,
        createdBy: userId,
        updatedBy: userId,
      },
    });
  }

  async listForUser(userId: string, applicationId?: string) {
    return this.prisma.document.findMany({
      where: { ownerUserId: userId, deletedAt: null, ...(applicationId ? { applicationId } : {}) },
      orderBy: { createdAt: 'desc' },
    });
  }

  async downloadUrl(id: string, actorId: string, role: Role) {
    const d = await this.prisma.document.findUnique({ where: { id } });
    if (!d) throw new NotFoundException();
    if (role !== Role.ADMIN && d.ownerUserId !== actorId) throw new ForbiddenException();
    return { url: await this.storage.presignDownload(d.storageKey) };
  }

  async verify(id: string, actorId: string, dto: VerifyDocumentDto) {
    return this.prisma.document.update({
      where: { id },
      data: {
        status: dto.status,
        rejectionReason: dto.rejectionReason,
        updatedBy: actorId,
      },
    });
  }
}
