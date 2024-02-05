/**
 * Класс входной модели исполнителя задачи.
 */
export class ProjectTaskExecutorInput {
    /**
     * Id нового исполнителя.
     */
    executorId: number = 0;

    /**
     * Id задачи в рамках проекта.
     */
    projectTaskId: number = 0;

    /**
     * Id проекта.
     */
    projectId: number = 0;
}