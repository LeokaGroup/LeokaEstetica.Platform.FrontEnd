/**
 * Класс расширенной входной модели комментария задачи.
 */
export class TaskCommentExtendedInput {
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

  /**
   * Id комментария.
   */
  commentId: number = 0;
}
