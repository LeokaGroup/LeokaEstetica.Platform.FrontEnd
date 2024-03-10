/**
 * Класс входной модели создания задачи.
 */
export class CreateProjectManagementTaskInput {
  /**
   * Признак быстрого создания задачи.
   */
  isQuickCreate: boolean = false;

  /**
   * Id проекта.
   */
  projectId: number = 0;

  /**
   * Название задачи.
   */
  name: string | null | undefined;

  /**
   * Описание задачи.
   */
  details: string | null | undefined;

  /**
   * Id наблюдателей задачи.
   */
  watcherIds: number[] = [];

  /**
   * Id статуса задачи.
   */
  taskStatusId: number = 0;

  /**
   * Id тегов (меток) задачи.
   */
  tagIds: number[] = [];

  /**
   * Id типа задачи.
   */
  taskTypeId: number = 0;

  /**
   * Id исполнителя задачи.
   */
  executorId: number | null | undefined;

  /**
   * Id приоритета задачи.
   */
  priorityId: number | null | undefined;

  /**
   * Дата начала эпика.
   */
  dateStart: Date | null | undefined;

  /**
   * Дата окончания эпика.
   */
  dateEnd: Date | null | undefined;
}
