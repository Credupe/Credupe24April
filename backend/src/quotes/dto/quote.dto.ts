import { ApiProperty } from '@nestjs/swagger';
import { LoanType } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateQuoteDto {
  @ApiProperty({ enum: LoanType }) @IsEnum(LoanType) loanType: LoanType;
  @ApiProperty() @Type(() => Number) @IsNumber() amount: number;
  @ApiProperty() @Type(() => Number) @IsInt() @Min(1) tenureMonths: number;

  // Customer profile snapshot — either pulled from the auth token's profile
  // or submitted inline for unauthenticated "instant check" flows.
  @ApiProperty({ required: false }) @IsOptional() @Type(() => Number) @IsNumber() monthlyIncome?: number;
  @ApiProperty({ required: false }) @IsOptional() @Type(() => Number) @IsInt() cibilScore?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsString() city?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() state?: string;

  // Optional contact (only used when user is not logged in)
  @ApiProperty({ required: false }) @IsOptional() @IsString() fullName?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() mobile?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() email?: string;
}

export class ConvertQuoteDto {
  @ApiProperty({ required: false, description: 'Which offer (productId) to convert. Defaults to best-ranked.' })
  @IsOptional() @IsString() productId?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() purpose?: string;
}
