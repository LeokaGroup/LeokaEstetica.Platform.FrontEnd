/**
 * Класс входной модели создания вакансии.
 */
export class CreateVacancyInput {
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
}