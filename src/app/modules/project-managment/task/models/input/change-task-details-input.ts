import { BaseChangeTaskInput } from "./base-change-task-input";

/**
 * Класс входной модели изменения описания задачи.
 */
export class ChangeTaskDetailsInput extends BaseChangeTaskInput {
    /**
     * Новое описание задачи.
     */
    changedTaskDetails: string = "";
}