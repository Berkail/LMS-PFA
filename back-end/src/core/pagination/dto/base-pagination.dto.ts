import {
  IsInt,
  IsOptional,
  IsObject,
  IsString,
  IsArray,
} from 'class-validator';

export class BasePaginationDto {
  @IsOptional()
  @IsInt()
  limit?: number = 10;

  @IsOptional()
  @IsObject()
  filter?: Record<string, any> = {};

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  sort?: { field: string; direction: 'asc' | 'desc' }[] = [];
}
