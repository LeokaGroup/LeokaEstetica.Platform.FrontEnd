/**
 * Класс входной модели создания страницы Wiki проекта.
 */
export class CreateWikiPageInput {
  /**
   * Id родителя, если передали (родительская папка).
   */
  parentId?: number;

  /**
   * Название страницы.
   */
  pageName: string = "";

  /**
   * Id дерева.
   */
  wikiTreeId: number = 0;
}
