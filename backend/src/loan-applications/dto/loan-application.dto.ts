import { ApiProperty } from '@nestjs/swagger';
import { ApplicationStatus, LoanType } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsNumber, IsObject, IsOptional, IsString, Min } from 'class-validator';

export class CreateLoanApplicationDto {
  @ApiProperty({ enum: LoanType }) @IsEnum(LoanType) loanType: LoanType;
  @ApiProperty() @Type(() => Number) @IsNumber() amountRequested: number;
  @ApiProperty() @Type(() => Number) @IsInt() @Min(1) tenureMonths: number;
  @ApiProperty({ required: false }) @IsOptional() @IsString() productId?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() purpose?: string;
  @ApiProperty({ required: false, description: 'Loan-type-specific dynamic fields' })
  @IsOptional() @IsObject() formData?: Record<string, any>;
}

export class UpdateLoanApplicationDto {
  @ApiProperty({ required: false }) @IsOptional() @Type(() => Number) @IsNumber() amountRequested?: number;
  @ApiProperty({ required: false }) @IsOptional() @Type(() => Number) @IsInt() tenureMonths?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsString() purpose?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsObject() formData?: Record<string, any>;
  @ApiProperty({ required: false }) @IsOptional() @IsString() productId?: string;
}

export class TransitionApplicationDto {
  @ApiProperty({ enum: ApplicationStatus }) @IsEnum(ApplicationStatus) toStatus: ApplicationStatus;
  @ApiProperty({ required: false }) @IsOptional() @IsString() note?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() rejectionReason?: string;
  @ApiProperty({ required: false }) @IsOptional() @Type(() => Number) @IsNumber() approvedAmount?: number;
  @ApiProperty({ required: false }) @IsOptional() @Type(() => Number) @IsInt() approvedTenure?: number;
  @ApiProperty({ required: false }) @IsOptional() @Type(() => Number) @IsNumber() approvedRate?: number;
}
