import { Repository } from 'typeorm';
import { PaginationStrategy } from './pagination-strategy.interface';
import { PaginationResult } from './result/pagination-result.interface';
import { CursorPaginationParams } from './params/cursor-pagination-params.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CursorPaginationStrategy<T extends { id: string | number }>
  implements PaginationStrategy<T>
{
  async paginate(
    repository: Repository<T>,
    params: CursorPaginationParams,
  ): Promise<PaginationResult<T>> {
    const { limit = 10, cursor, filter = {}, sort = [] } = params;

    let orderBy: Record<string, 'ASC' | 'DESC'>;
    if (sort.length > 0) {
      orderBy = sort.reduce(
        (acc, { field, direction }) => {
          acc[field] = direction.toUpperCase() as 'ASC' | 'DESC';
          return acc;
        },
        {} as Record<string, 'ASC' | 'DESC'>,
      );
    } else {
      orderBy = { id: 'ASC' };
    }

    const queryBuilder = repository
      .createQueryBuilder('entity')
      .where(filter)
      .orderBy(orderBy)
      .take(limit + 1);

    if (cursor) {
      queryBuilder.andWhere('entity.id > :cursor', { cursor });
    }

    const results = await queryBuilder.getMany();

    const hasMore = results.length > limit;
    const data = hasMore ? results.slice(0, limit) : results;
    const nextCursor = hasMore ? String(data[data.length - 1].id) : undefined;

    return {
      data,
      metadata: {
        hasMore,
        nextCursor,
      },
    };
  }
}
