/**
 * Класс входной модели обновления задачи спринта.
 */
export class UpdateTaskSprintInput {
  /**
   * Id спринта.
   */
  sprintId: number = 0;

  /**
   * Id задачи в рамках проекта.
   */
  projectTaskId: string = "";
}
