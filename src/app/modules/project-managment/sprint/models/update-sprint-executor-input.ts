/**
 * Класс входной модели обновления исполнителя спринта.
 */
export class UpdateSprintExecutorInput {
  /**
   * Id спринта в рамках проекта.
   */
  projectSprintId: number = 0;

  /**
   * Id проекта.
   */
  projectId: number = 0;

  /**
   * Id исполнителя спринта.
   */
  executorId: number = 0;
}
