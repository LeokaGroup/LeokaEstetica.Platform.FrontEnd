import { FilterProjectInput } from "src/app/modules/project/detail/models/input/filter-project-input";
import { API_URL } from "../core-urls/api-urls";

/**
 * Класс билдера для построения api ендпоинтов.
 */
export abstract class ProjectApiBuilder {
    /**
     * Функция создает апи для ендпоинта фильтров проектов.
     * @param filterProjectInput - Входная модель.
     * @returns - Api-url.
     */
    public static createProjectsFilterApi(filterProjectInput: FilterProjectInput): string {
        let apiUrl: any[] = [
            API_URL.apiUrl,
            "/projects/filter"
        ];

        if (filterProjectInput.Date !== "" && filterProjectInput.Date !== null) {
            apiUrl.push(`?date=${filterProjectInput.Date}`);
        }

        if (filterProjectInput.StageValues !== "" && filterProjectInput.StageValues !== null) {
            apiUrl.push(`&stageValues=${filterProjectInput.StageValues}`);
        }

        apiUrl.push(`&isAnyVacancies=${filterProjectInput.IsAnyVacancies}`);

        return apiUrl.join("");;
    };
}