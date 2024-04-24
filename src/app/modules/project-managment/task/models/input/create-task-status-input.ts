/**
 * Класс входной модели создания статуса.
 */
export class CreateTaskStatusInput {
    /**
     * Системное названия статуса, с которым ассоциируется новый статус.
     */
    associationStatusSysName: string = "";

    /**
     * Название статуса.
     */
    statusName: string = "";

    /**
     * Описание статуса. 
     */
    statusDescription: string = "";

    /**
     * Id проекта.
     */
    projectId: number = 0;
}