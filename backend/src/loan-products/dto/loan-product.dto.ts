import { ApiProperty } from '@nestjs/swagger';
import { LoanType } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize, IsArray, IsBoolean, IsEnum, IsInt, IsNumber, IsOptional, IsString, Min,
} from 'class-validator';

export class UpsertLoanProductDto {
  @ApiProperty() @IsString() lenderId: string;
  @ApiProperty() @IsString() name: string;
  @ApiProperty() @IsString() slug: string;
  @ApiProperty({ enum: LoanType }) @IsEnum(LoanType) loanType: LoanType;
  @ApiProperty() @Type(() => Number) @IsNumber() minAmount: number;
  @ApiProperty() @Type(() => Number) @IsNumber() maxAmount: number;
  @ApiProperty() @Type(() => Number) @IsInt() @Min(1) minTenureMonths: number;
  @ApiProperty() @Type(() => Number) @IsInt() @Min(1) maxTenureMonths: number;
  @ApiProperty() @Type(() => Number) @IsNumber() minInterestRate: number;
  @ApiProperty() @Type(() => Number) @IsNumber() maxInterestRate: number;
  @ApiProperty({ required: false }) @IsOptional() @Type(() => Number) @IsNumber() processingFeePct?: number;
  @ApiProperty({ required: false }) @IsOptional() @Type(() => Number) @IsNumber() minMonthlyIncome?: number;
  @ApiProperty({ required: false }) @IsOptional() @Type(() => Number) @IsInt() minCibilScore?: number;
  @ApiProperty({ required: false, type: [String] })
  @IsOptional() @IsArray() @ArrayMaxSize(200) allowedCities?: string[];
  @ApiProperty({ required: false, type: [String] })
  @IsOptional() @IsArray() @ArrayMaxSize(200) allowedStates?: string[];
  @ApiProperty({ required: false }) @IsOptional() @Type(() => Number) @IsNumber() commissionPct?: number;
  @ApiProperty({ required: false, default: true }) @IsOptional() @IsBoolean() active?: boolean;
}

export class EligibilityQueryDto {
  @ApiProperty({ enum: LoanType }) @IsEnum(LoanType) loanType: LoanType;
  @ApiProperty() @Type(() => Number) @IsNumber() amount: number;
  @ApiProperty({ required: false }) @IsOptional() @Type(() => Number) @IsInt() tenureMonths?: number;
  @ApiProperty({ required: false }) @IsOptional() @Type(() => Number) @IsNumber() monthlyIncome?: number;
  @ApiProperty({ required: false }) @IsOptional() @Type(() => Number) @IsInt() cibilScore?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsString() city?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() state?: string;
}
