import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser, AuthUser } from '../common/decorators/current-user.decorator';
import { DocumentsService } from './documents.service';
import { PresignDocumentDto, RegisterDocumentDto, VerifyDocumentDto } from './dto/document.dto';

@ApiTags('Documents')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('documents')
export class DocumentsController {
  constructor(private readonly svc: DocumentsService) {}

  @Post('presign')
  presign(@CurrentUser() u: AuthUser, @Body() dto: PresignDocumentDto) {
    return this.svc.presign(u.sub, dto);
  }

  @Post()
  register(@CurrentUser() u: AuthUser, @Body() dto: RegisterDocumentDto) {
    return this.svc.register(u.sub, dto);
  }

  @Get()
  list(@CurrentUser() u: AuthUser, @Query('applicationId') applicationId?: string) {
    return this.svc.listForUser(u.sub, applicationId);
  }

  @Get(':id/download')
  download(@Param('id') id: string, @CurrentUser() u: AuthUser) {
    return this.svc.downloadUrl(id, u.sub, u.role as Role);
  }

  @Roles(Role.ADMIN) @Patch(':id/verify')
  verify(@Param('id') id: string, @CurrentUser() a: AuthUser, @Body() dto: VerifyDocumentDto) {
    return this.svc.verify(id, a.sub, dto);
  }
}
