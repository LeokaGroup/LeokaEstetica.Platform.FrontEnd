/**
 * Класс базовой модели настроек проекта.
 */
export class BaseScrumSettingInput {
  /**
   * Id проекта.
   */
  projectId: number = 0;

  /**
   * Признак выбранной настройки.
   */
  isSettingSelected: boolean = false;

  /**
   * Системное название настройки.
   */
  sysName: string = "";
}
