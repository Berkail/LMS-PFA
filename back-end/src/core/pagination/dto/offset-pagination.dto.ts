import { IsInt } from 'class-validator';
import { BasePaginationDto } from './base-pagination.dto';

export class OffsetPaginationDto extends BasePaginationDto {
  @IsInt()
  offset: number;
}
