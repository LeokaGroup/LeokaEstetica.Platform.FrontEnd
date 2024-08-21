/**
 * Перечисление типов фильтров стадий проекта.
 */
export enum FilterProjectStageTypeEnum {
  /**
   * Отсутствует. Не ищем по этому значению.
   */
  none = 1,

  /**
   * Идея.
   */
  concept = 2,

  /**
   * Поиск команды.
   */
  searchTeam = 3,

  /**
   * Проектирование.
   */
  projecting = 4,

  /**
   * Разработка.
   */
  development = 5,

  /**
   * Разработка.
   */
  testing = 6,

  /**
   * Поиск инвесторов.
   */
  searchInvestors = 7,

  /**
   * Запуск.
   */
  start = 8,

  /**
   * Поддержка.
   */
  support = 9
}
