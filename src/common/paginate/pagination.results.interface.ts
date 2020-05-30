export interface PaginationResultInterface<PaginationEntity> {
  list: PaginationEntity[];
  total: number;
  next?: string;
  previous?: string;
}