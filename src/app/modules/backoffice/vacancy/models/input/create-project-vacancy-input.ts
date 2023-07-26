/**
 * Класс входной модели создания вакансии проекта.
 */
export class CreateProjectVacancyInput {
    /**
     * Название вакансии.
     */
    VacancyName: string = "";

    /**
     * Описание вакансии.
     */
    VacancyText: string = "";

    /**
     * Опыт работы.
     */
    WorkExperience: string = "";

    /**
     * Занятость у вакансии.
     */
    Employment: string = "";

    /**
     * Оплата у вакансии.
     */
    Payment: string = "";

    /**
     * Id проекта.
     */
    ProjectId: number = 0;
}