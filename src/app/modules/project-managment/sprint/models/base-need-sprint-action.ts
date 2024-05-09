import { NeedSprintActionTypeEnum } from "../enums/need-sprint-action-type-enum";

export class BaseNeedSprintAction {
  /**
   * Список действий.
   */
  actionVariants: NeedSprintActionVariants[] = [];

  /**
   * Признак необходимости какого-либо действия от пользователя.
   */
  isNeedUserAction: boolean = false;

  /**
   * Тип действия, которое ожидается от пользователя.
   */
  needSprintActionType: NeedSprintActionTypeEnum = NeedSprintActionTypeEnum.notCompletedTask;
}

/**
 * Класс вариантов действий.
 */
export class NeedSprintActionVariants {
  /**
   * Название варианта.
   */
  variantName: string = "";

  /**
   * Системное название варианта.
   */
  variantSysName: string = "";

  /**
   * Признак выбора действия пользователем.
   */
  isSelected: boolean = false;

  /**
   * Признак активности варианта.
   * Если проходим по условиям, то пункт активен.
   */
  isAvailable: boolean = false;

  /**
   * Подсказка причины неактивности варианта действия.
   */
  notAvailableTooltip: string = "";
}
