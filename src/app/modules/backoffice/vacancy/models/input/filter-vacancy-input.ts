import { CatalogFilter } from "./catalog-filter";

export class FilterVacancyInput {
  /**
   * lastId предыдущего запроса.
   */
  lastId: number = 0;

  /**
   * Кол-во записаей на страницу.
   */
  paginationRows: number = 20;

  /**
   * Фильтры.
   */
  filters: CatalogFilter = {};

  /**
   * Строка для текстовго поиска.
   */
  searchText: string = "";

  /**
   * Флаг включения пагинации.
   */
  isPagination: boolean = true;
}
