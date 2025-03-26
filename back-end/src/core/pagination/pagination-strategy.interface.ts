import { ObjectLiteral, Repository } from "typeorm";
import { BasePaginationParams } from "./params/base-pagination-params.interface";
import { PaginationResult } from "./result/pagination-result.interface";

export interface PaginationStrategy<T extends ObjectLiteral> {
    paginate(
      repository: Repository<T>,
      params: BasePaginationParams,
    ): Promise<PaginationResult<T>>;
}