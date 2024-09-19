/**
 * Класс входной модели создания папки Wiki проекта.
 */
export class CreateWikiFolderInput {
  /**
   * Id родителя, если передали (родительская папка).
   */
  parentId?: number;

  /**
   * Название папки.
   */
  folderName: string = "";

  /**
   * Id дерева.
   */
  wikiTreeId?: number | null;

  /**
   * Id проекта.
   */
  projectId: number = 0;
}
