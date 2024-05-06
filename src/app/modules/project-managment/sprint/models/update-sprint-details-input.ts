/**
 * Класс входной модели обновления описание спринта.
 */
export class UpdateSprintDetailsInput {
  /**
   * Id спринта в рамках проекта.
   */
  projectSprintId: number = 0;

  /**
   * Id проекта.
   */
  projectId: number = 0;

  /**
   * Новое название спринта.
   */
  sprintDetails: string = "";
}
