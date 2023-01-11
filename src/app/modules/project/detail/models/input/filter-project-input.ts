/**
 * Класс входной модели фильтрации проектов.
 */
export class FilterProjectInput {
    /**
     * Фильтр по дате.
     */
    Date: string = "";

    /**
     * Фильтр по наличию вакансий у проектов.
     */
    IsAnyVacancies: boolean = false;

    /**
     * Фильтр по стадиям проекта.
     */
    StageValues: string = "";
}