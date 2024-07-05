/**
 * Класс входной модели имзенения названия страницы папки Wiki проекта.
 */
export class UpdateFolderPageDescriptionInput {
  /**
   * Id страницы.
   */
  pageId: number = 0;

  /**
   * Новое описания страницы папки.
   */
  pageDescription: string = "";
}
