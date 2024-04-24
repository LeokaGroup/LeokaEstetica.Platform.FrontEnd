/**
 * Класс базовой входной модели изменения задачи.
 */
export class BaseChangeTaskInput {
    /**
     * Id проекта.
     */
    projectId: number = 0;

    /**
     * Id задачи (здесь имеется в виду Id задачи в рамках проекта).
     */
    taskId: number = 0;
}