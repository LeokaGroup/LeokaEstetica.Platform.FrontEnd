export class CatalogProjectInput {
  lastId?: number | null;

  paginationRows?: number | null;

  date: string = "";

  isAnyVacancies: boolean = false;

  stageValues?: string | null;

  searchText: string = "";
}
