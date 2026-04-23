import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class PaginationQueryDto {
  @ApiProperty({ required: false, default: 1, minimum: 1 })
  @IsOptional() @Type(() => Number) @IsInt() @Min(1)
  page?: number = 1;

  @ApiProperty({ required: false, default: 20, minimum: 1, maximum: 100 })
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(100)
  pageSize?: number = 20;

  @ApiProperty({ required: false })
  @IsOptional() @IsString()
  search?: string;

  @ApiProperty({ required: false, description: 'e.g. "createdAt:desc"' })
  @IsOptional() @IsString()
  sort?: string;
}

export function paginate(page = 1, pageSize = 20) {
  const p = Math.max(1, Number(page) || 1);
  const s = Math.min(100, Math.max(1, Number(pageSize) || 20));
  return { skip: (p - 1) * s, take: s, page: p, pageSize: s };
}

export function buildOrderBy(sort?: string, allowed: string[] = ['createdAt']) {
  if (!sort) return { createdAt: 'desc' as const };
  const [field, dir] = sort.split(':');
  if (!allowed.includes(field)) return { createdAt: 'desc' as const };
  return { [field]: dir === 'asc' ? 'asc' : 'desc' } as any;
}

export function paged<T>(items: T[], total: number, page: number, pageSize: number) {
  return {
    items,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}
