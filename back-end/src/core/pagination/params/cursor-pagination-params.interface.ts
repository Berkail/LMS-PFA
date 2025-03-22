import { BasePaginationParams } from './base-pagination-params.interface';

export interface CursorPaginationParams extends BasePaginationParams {
  cursor?: string;
}
