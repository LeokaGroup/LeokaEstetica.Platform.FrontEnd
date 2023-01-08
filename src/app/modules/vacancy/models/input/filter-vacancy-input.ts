export class FilterVacancyInput {
    /**
     * Тип фильтра по соответствиям.
     */
    Salary: string = "";

    /**
     * Фильтр оплаты.
     */
    Pay: string = "";

    /**
     * Фильтр опыта работы.
     */
    Experience: string = "";

    /**
     * Фильтр занятости.
     */
     Employments: string[] = [];

    /**
     * Фильтр ключевых слов.
     */
    Keywords: string = "";
}