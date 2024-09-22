import { CatalogFilter } from "./catalog-project-filters";

export class CatalogProjectInput {
  lastId: number = 0;

  paginationRows: number = 20;

  filters: CatalogFilter = {};

  searchText: string = "";

  isPagination: boolean = true;
}
