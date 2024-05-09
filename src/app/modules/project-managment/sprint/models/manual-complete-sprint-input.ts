import {BaseNeedSprintAction} from "./base-need-sprint-action";
import {SprintInput} from "./sprint-input";

/**
 * Данные действий пользователя, если они есть.
 */
export class ManualCompleteSprintInput extends SprintInput {
  /**
   * Данные действий пользователя, если они есть.
   */
  baseNeedSprintAction?: BaseNeedSprintAction;

  /**
   * Признак обработанного действия пользователем (т.е. если он выбрал действие уже).
   */
  isProcessedAction: boolean = false;

  /**
   * Список незавершенных задач спринта.
   */
  notCompletedSprintTaskIds: number[] = [];

  /**
   * Id спринта для переноса в него задач.
   */
  moveSprintId: number = 0;

  /**
   * Название нового спринта для переноса в него задач.
   */
  moveSprintName: string = "";
}
