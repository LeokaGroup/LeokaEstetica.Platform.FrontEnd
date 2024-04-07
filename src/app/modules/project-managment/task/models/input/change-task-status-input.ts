/**
 * Класс входной модели изменения статуса задачи.
 */
export class ChangeTaskStatusInput {
    /**
     * Id проекта.
     */
    projectId: number = 0;

    /**
     * Id статуса, на который нужно обновить.
     */
    changeStatusId: number = 0;

    /**
     * Id задачи (здесь имеется в виду Id задачи в рамках проекта).
     */
    taskId: number = 0;

  /**
   * Тип детализации.
   */
  taskDetailType: number = 0;
}
