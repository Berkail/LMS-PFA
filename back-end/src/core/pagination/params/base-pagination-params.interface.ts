export interface BasePaginationParams {
  limit?: number;
  filter?: Record<string, any>;
  sort?: { field: string; direction: 'asc' | 'desc' }[];
}
