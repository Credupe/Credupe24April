import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, Length, MinLength, Matches } from 'class-validator';
import { Role } from '@prisma/client';

export class RegisterDto {
  @ApiProperty() @IsEmail() email: string;
  @ApiProperty({ required: false }) @IsOptional() @Matches(/^\+?\d{10,15}$/) mobile?: string;
  @ApiProperty() @IsString() @MinLength(8) password: string;
  @ApiProperty({ enum: Role, default: Role.CUSTOMER }) @IsOptional() @IsEnum(Role) role?: Role;
  @ApiProperty({ required: false }) @IsOptional() @IsString() firstName?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() lastName?: string;
  @ApiProperty({ required: false, description: 'Required when role=PARTNER' })
  @IsOptional() @IsString() businessName?: string;
}

export class LoginDto {
  @ApiProperty() @IsEmail() email: string;
  @ApiProperty() @IsString() @IsNotEmpty() password: string;
}

export class RefreshTokenDto {
  @ApiProperty() @IsString() @IsNotEmpty() refreshToken: string;
}

export class OtpRequestDto {
  @ApiProperty({ description: 'Phone number in E.164' })
  @Matches(/^\+?\d{10,15}$/) destination: string;
  @ApiProperty({ default: 'login' }) @IsOptional() @IsString() purpose?: string;
}

export class OtpVerifyDto {
  @ApiProperty() @Matches(/^\+?\d{10,15}$/) destination: string;
  @ApiProperty() @IsString() @Length(4, 8) code: string;
  @ApiProperty({ default: 'login' }) @IsOptional() @IsString() purpose?: string;
}
