/**
 * Класс входной модели связи с задачей.
 */
export class TaskLinkInput {
    /**
     * Id задачи, от которой исходит связь.
     */
    taskFromLink: number = 0;

    /**
     * Id задачи, которую связывают.
     */
    taskToLink: number = 0;

    /**
     * Тип связи задачи.
     */
    linkType: string = "";

    /**
     * Id проекта.
     */
    projectId: number = 0;
}