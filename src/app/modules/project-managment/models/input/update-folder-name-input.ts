/**
 * Класс входной модели имзенения названия папки Wiki проекта.
 */
export class UpdateFolderNameInput {
  /**
   * Id папки.
   */
  folderId: number = 0;

  /**
   * Новое название папки.
   */
  folderName: string = "";
}
