import { Module } from '@nestjs/common';
import { CursorPaginationStrategy } from './cursor-pagination.strategy';

@Module({
  imports: [],
  providers: [
    {
      provide: 'PAGINATION_SERVICE',
      useClass: CursorPaginationStrategy,
    },
  ],
  exports: ['PAGINATION_SERVICE'],
})
export class PaginationModule {}
