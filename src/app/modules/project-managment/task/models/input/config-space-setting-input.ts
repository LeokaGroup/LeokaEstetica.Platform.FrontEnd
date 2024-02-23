/**
 * Класс входной модели настроек рабочего пространства модуля УП.
 */
export class ConfigSpaceSettingInput {
  /**
   * Стратегия представления.
   */
  strategy: string = "";

  /**
   * Id шаблона.
   */
  templateId: number = 0;

  /**
   * Id проекта.
   */
  projectId: number = 0;

  /**
   * Название в управлении проектом.
   */
  projectManagementName: string = "";

  /**
   * Префикс названия в управлении проектом.
   */
  projectManagementNamePrefix: string = "";
}
