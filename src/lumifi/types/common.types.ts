export interface IPagination {
  currentPage: number;
  rowsPerPage: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  nextPage: number | null;
  previousPage: number | null;
}

export interface IPaginationProps {
  paginationData: IPagination;
  handlePagination: (pageNumber: number, limit: number) => void;
}

export enum TablePaginationLimit {
  FIVE = 5,
  TEN = 10,
  TWENTY_FIVE = 25,
}

export const DEFAULT_TABLE_PAGE = 1;
export const DEFAULT_TABLE_LIMIT = TablePaginationLimit.FIVE;
