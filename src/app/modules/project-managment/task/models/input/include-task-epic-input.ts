/**
 * Класс входной модели включения задачи в эпик.
 */
export class IncludeTaskEpicInput {
  /**
   * Id эпика.
   */
  epicId: string = "";

  /**
   * Id задач в рамках проекта.
   */
  projectTaskIds: string[] = [];
}
