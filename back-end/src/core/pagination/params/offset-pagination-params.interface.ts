import { BasePaginationParams } from "./base-pagination-params.interface";

export interface OffsetPaginationParams extends BasePaginationParams {
    offset: number;
}