/**
 * Класс входной модели наблюдателей задачи.
 */
export class ProjectTaskWatcherInput {
    /**
     * Id нового наблюдателя задачи.
     */
    watcherId: number = 0;

    /**
     * Id задачи в рамках проекта.
     */
    projectTaskId: number = 0;

    /**
     * Id проекта.
     */
    projectId: number = 0;
}