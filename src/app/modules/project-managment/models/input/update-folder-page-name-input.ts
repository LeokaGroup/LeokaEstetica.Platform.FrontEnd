/**
 * Класс входной модели имзенения названия страницы папки Wiki проекта.
 */
export class UpdateFolderPageNameInput {
  /**
   * Id страницы.
   */
  pageId: number = 0;

  /**
   * Новое название страницы папки.
   */
  pageName: string = "";
}
