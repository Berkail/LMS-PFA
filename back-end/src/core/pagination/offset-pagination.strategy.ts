import { FindOptionsOrder, ObjectLiteral, Repository } from 'typeorm';
import { PaginationStrategy } from './pagination-strategy.interface';
import { PaginationResult } from './result/pagination-result.interface';
import { OffsetPaginationParams } from './params/offset-pagination-params.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OffsetPaginationStrategy<T extends ObjectLiteral>
  implements PaginationStrategy<T>
{
  async paginate(
    repository: Repository<T>,
    params: OffsetPaginationParams,
  ): Promise<PaginationResult<T>> {
    const { limit = 10, offset = 0, filter = {}, sort = [] } = params;

    const sortOptions: FindOptionsOrder<T> = sort.reduce(
      (acc, { field, direction }) => {
        (acc as any)[field] = direction === 'asc' ? 'ASC' : 'DESC';
        return acc;
      },
      {} as FindOptionsOrder<T>,
    );

    const data = await repository.find({
      where: filter,
      skip: offset,
      take: limit,
      order: sortOptions,
    });

    const count = await repository.count(filter);

    return {
      data,
      metadata: {
        count,
        hasMore: offset + limit < count,
      },
    };
  }
}
