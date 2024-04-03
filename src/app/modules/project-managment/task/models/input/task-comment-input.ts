/**
 * Класс входной модели комментария задачи.
 */
export class TaskCommentInput {
  /**
   * Id задачи в рамках проекта.
   */
  projectTaskId: string = "";

  /**
   * Id проекта.
   */
  projectId: number = 0;

  /**
   * Комментарий.
   */
  comment: string = "";
}
