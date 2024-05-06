/**
 * Класс входной модели обновления названия спринта.
 */
export class UpdateSprintNameInput {
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
  sprintName: string = "";
}
