import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { EmploymentType } from '@prisma/client';
import { IsDate, IsEnum, IsNumber, IsOptional, IsString, Length, Matches } from 'class-validator';

export class UpsertCustomerProfileDto {
  @ApiProperty({ required: false }) @IsOptional() @IsString() firstName?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() lastName?: string;
  @ApiProperty({ required: false }) @IsOptional() @Type(() => Date) @IsDate() dob?: Date;
  @ApiProperty({ required: false }) @IsOptional() @IsString() gender?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() city?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() state?: string;
  @ApiProperty({ required: false }) @IsOptional() @Matches(/^\d{6}$/) pincode?: string;
  @ApiProperty({ required: false, description: 'Full PAN — only last 4 digits are persisted' })
  @IsOptional() @Matches(/^[A-Z]{5}[0-9]{4}[A-Z]$/) pan?: string;
  @ApiProperty({ required: false, description: 'Full Aadhaar — only last 4 digits are persisted' })
  @IsOptional() @Matches(/^\d{12}$/) aadhaar?: string;
  @ApiProperty({ required: false, enum: EmploymentType }) @IsOptional() @IsEnum(EmploymentType) employmentType?: EmploymentType;
  @ApiProperty({ required: false }) @IsOptional() @Type(() => Number) @IsNumber() monthlyIncome?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsString() employerName?: string;
  @ApiProperty({ required: false, description: 'e.g. "750-800"' }) @IsOptional() @IsString() @Length(3, 20) cibilRange?: string;
}
