/**
 * Класс входной модели вакансии.
 */
export class VacancyInput {
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
     * Id вакансии.
     */
    VacancyId: number = 0;
}