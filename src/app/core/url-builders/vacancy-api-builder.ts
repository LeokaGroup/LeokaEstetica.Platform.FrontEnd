import { FilterVacancyInput } from "src/app/modules/backoffice/vacancy/models/input/filter-vacancy-input";
import { API_URL } from "../core-urls/api-urls";

/**
 * Класс билдера для построения api ендпоинтов.
 */
export abstract class VacancyApiBuilder {
    /**
     * Функция создает апи для ендпоинта фильтров вакансий.
     * @param filterVacancyInput - Входная модель.
     * @returns - Api-url.
     */
    public static createVacanciesFilterApi(filterVacancyInput: FilterVacancyInput): string {
        let apiUrl: any[] = [
            API_URL.apiUrl,
            "/vacancies/filter"
        ];

        if (filterVacancyInput.Salary !== "" && filterVacancyInput.Salary !== null) {
            apiUrl.push(`?salary=${filterVacancyInput.Salary}`);
        }

        if (filterVacancyInput.Pay !== "" && filterVacancyInput.Pay !== null) {
            apiUrl.push(`&pay=${filterVacancyInput.Pay}`);
        }

        if (filterVacancyInput.Experience !== "" && filterVacancyInput.Experience !== null) {
            apiUrl.push(`&experience=${filterVacancyInput.Experience}`);
        }

        if (filterVacancyInput.EmploymentsValues !== "" && filterVacancyInput.EmploymentsValues !== null) {
            apiUrl.push(`&employmentsValues=${filterVacancyInput.EmploymentsValues}`);
        }

        return apiUrl.join("");
    };
}