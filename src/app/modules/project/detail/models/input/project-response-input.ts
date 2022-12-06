/**
 * Класс входной модели записи отклика на проект.
 * Либо с указанием вакансии либо без нее.
 */
export class ProjectResponseInput {
    /**
     * Id проекта.
     */
    ProjectId: number = 0;

    /**
     * Id вакансии.
     */
    VacancyId?: number;
}