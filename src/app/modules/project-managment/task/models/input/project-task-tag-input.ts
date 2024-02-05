/**
 * Класс входной модели тега задачи.
 */
export class ProjectTaskTagInput {
    /**
     * Id тега.
     */
    tagId: number = 0;

    /**
     * Id задачи в рамках проекта.
     */
    projectTaskId: number = 0;

    /**
     * Id проекта.
     */
    projectId: number = 0;
}