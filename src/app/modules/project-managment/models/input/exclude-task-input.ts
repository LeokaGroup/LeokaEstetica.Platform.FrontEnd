export class ExcludeTaskInput {
  /**
   * Id эпика.
   */
  epicSprintId: number = 0;

  /**
   * Список Id задач в рамках проекта, которые нужно исключить из эпика.
   */
  projectTaskIds: number[] = [];
}
