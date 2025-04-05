export interface PaginationResult<T> {
  data: T[];
  metadata: {
    count?: number;
    nextCursor?: string;
    hasMore: boolean;
  };
}
