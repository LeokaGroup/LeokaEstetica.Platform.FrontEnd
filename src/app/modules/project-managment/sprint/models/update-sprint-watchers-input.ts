/**
 * Класс входной модели обновления наблюдателей спринта.
 */
export class UpdateSprintWatchersInput {
  /**
   * Id спринта в рамках проекта.
   */
  projectSprintId: number = 0;

  /**
   * Id проекта.
   */
  projectId: number = 0;

  /**
   * Id наблюдателей спринта.
   */
  watcherIds: number[] = [];
}
