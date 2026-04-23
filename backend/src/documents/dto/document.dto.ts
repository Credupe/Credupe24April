import { ApiProperty } from '@nestjs/swagger';
import { DocumentStatus, DocumentTag } from '@prisma/client';
import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class PresignDocumentDto {
  @ApiProperty() @IsString() fileName: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() mimeType?: string;
  @ApiProperty({ enum: DocumentTag, default: DocumentTag.OTHER })
  @IsOptional() @IsEnum(DocumentTag) tag?: DocumentTag;
  @ApiProperty({ required: false }) @IsOptional() @IsString() applicationId?: string;
}

export class RegisterDocumentDto {
  @ApiProperty() @IsString() storageKey: string;
  @ApiProperty() @IsString() fileName: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() mimeType?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsInt() @Min(0) sizeBytes?: number;
  @ApiProperty({ enum: DocumentTag, default: DocumentTag.OTHER })
  @IsOptional() @IsEnum(DocumentTag) tag?: DocumentTag;
  @ApiProperty({ required: false }) @IsOptional() @IsString() applicationId?: string;
}

export class VerifyDocumentDto {
  @ApiProperty({ enum: DocumentStatus }) @IsEnum(DocumentStatus) status: DocumentStatus;
  @ApiProperty({ required: false }) @IsOptional() @IsString() rejectionReason?: string;
}
