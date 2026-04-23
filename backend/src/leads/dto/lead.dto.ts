import { ApiProperty } from '@nestjs/swagger';
import { LeadStatus, LoanType } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsDateString, IsEmail, IsEnum, IsNumber, IsOptional, IsString, Matches } from 'class-validator';

export class CreateLeadDto {
  @ApiProperty() @IsString() customerName: string;
  @ApiProperty() @Matches(/^\+?\d{10,15}$/) customerMobile: string;
  @ApiProperty({ required: false }) @IsOptional() @IsEmail() customerEmail?: string;
  @ApiProperty({ enum: LoanType }) @IsEnum(LoanType) loanType: LoanType;
  @ApiProperty({ required: false }) @IsOptional() @Type(() => Number) @IsNumber() amountRequested?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsString() productId?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() city?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() notes?: string;
}

export class UpdateLeadDto {
  @ApiProperty({ required: false, enum: LeadStatus }) @IsOptional() @IsEnum(LeadStatus) status?: LeadStatus;
  @ApiProperty({ required: false }) @IsOptional() @IsString() notes?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() productId?: string;
}

export class AddFollowUpDto {
  @ApiProperty() @IsDateString() scheduledAt: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() note?: string;
}
