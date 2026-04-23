import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsIn, IsOptional, IsString, IsUrl } from 'class-validator';

export class UpsertLenderDto {
  @ApiProperty() @IsString() name: string;
  @ApiProperty() @IsString() slug: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() logoUrl?: string;
  @ApiProperty({ required: false, default: true }) @IsOptional() @IsBoolean() active?: boolean;
  @ApiProperty({ required: false, enum: ['mock', 'api', 'webhook'] })
  @IsOptional() @IsIn(['mock', 'api', 'webhook']) integrationMode?: 'mock' | 'api' | 'webhook';
  @ApiProperty({ required: false }) @IsOptional() @IsUrl({ require_tld: false }) webhookUrl?: string;
}
