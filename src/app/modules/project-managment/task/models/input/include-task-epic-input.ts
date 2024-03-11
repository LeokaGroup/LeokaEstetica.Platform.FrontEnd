/**
 * Класс входной модели включения задачи в эпик.
 */
export class IncludeTaskEpicInput {
  /**
   * Id эпика.
   */
  epicId: number = 0;

  /**
   * Id проекта.
   */
  projectId: number = 0;

  /**
   * Id проекта в рамках задачи.
   */
  projectTaskId: string = "";
}
