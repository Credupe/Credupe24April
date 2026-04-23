import { ApiProperty } from '@nestjs/swagger';
import { KycStatus } from '@prisma/client';
import { IsEnum, IsOptional, IsString, Matches } from 'class-validator';

export class UpsertPartnerProfileDto {
  @ApiProperty({ required: false }) @IsOptional() @IsString() businessName?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() contactPerson?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() city?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() state?: string;
  @ApiProperty({ required: false }) @IsOptional() @Matches(/^\d{6}$/) pincode?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() gstNumber?: string;
  @ApiProperty({ required: false }) @IsOptional() @Matches(/^[A-Z]{5}[0-9]{4}[A-Z]$/) pan?: string;
}

export class SetKycStatusDto {
  @ApiProperty({ enum: KycStatus }) @IsEnum(KycStatus) kycStatus: KycStatus;
}
