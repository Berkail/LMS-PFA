import { IsString, IsOptional } from 'class-validator';
import { BasePaginationDto } from './base-pagination.dto';

export class CursorPaginationDto extends BasePaginationDto {
  @IsOptional()
  @IsString()
  cursor?: string;
}
