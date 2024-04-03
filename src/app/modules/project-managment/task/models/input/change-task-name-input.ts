import { BaseChangeTaskInput } from "./base-change-task-input";

/**
 * Класс входной модели изменения названия задачи.
 */
 export class ChangeTaskNameInput extends BaseChangeTaskInput {
    /**
     * Новое название задачи.
     */
    changedTaskName: string = "";
}