/**
 * Класс входной модели приоритета задачи.
 */
export class TaskPriorityInput {
    /**
     * Id приоритета.
     */
    priorityId: number = 0;

    /**
     * Id задачи в рамках проекта.
     */
    projectTaskId: number = 0;

    /**
     * Id проекта.
     */
    projectId: number = 0;
}