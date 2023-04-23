/**
 * Класс входной модели замечаний к проекту.
 */
export class ProjectRemarkInput {
    /**
     * Название поля.
     */
    fieldName: string = "";

    /**
     * Текст замечания.
     */
    remarkText: string = "";

    /**
     * Id проекта.
     */
    projectId: number = 0;

    /**
     * Русское название поля.
     */
    russianName: string = "";
}