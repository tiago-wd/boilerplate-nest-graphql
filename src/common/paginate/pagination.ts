import { PaginationResultInterface } from "./pagination.results.interface";

export class Pagination<PaginationEntity> {
  public list: PaginationEntity[];
  public page_total: number;
  public total: number;

  constructor(paginationResults: PaginationResultInterface<PaginationEntity>) {
    this.list = paginationResults.list;
    this.page_total = paginationResults.list.length;
    this.total = paginationResults.total;
  }
}