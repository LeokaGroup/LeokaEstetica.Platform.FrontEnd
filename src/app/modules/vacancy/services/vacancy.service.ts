import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { API_URL } from 'src/app/core/core-urls/api-urls';
import { VacancyApiBuilder } from 'src/app/core/url-builders/vacancy-api-builder';
import { CreateProjectVacancyInput } from '../models/input/create-project-vacancy-input';
import { FilterVacancyInput } from '../models/input/filter-vacancy-input';
import { VacancyInput } from '../models/input/vacancy-input';

@Injectable()
export class VacancyService {
    public vacancy$ = new BehaviorSubject<any>(null);
    public catalog$ = new BehaviorSubject<any>(null);
    public selectedVacancy$ = new BehaviorSubject<any>(null);
    public pagination$ = new BehaviorSubject<any>(null);

    constructor(private readonly http: HttpClient) {

    }

    /**
     * Функция создает новую вакансию вне проекта.
     * @returns - Данные вакансии.
     */
    public async createVacancyAsync(createVacancyInput: VacancyInput) {
        return await this.http.post(API_URL.apiUrl + "/vacancies/vacancy", createVacancyInput).pipe(
            tap(data => this.vacancy$.next(data))
        );
    };

    /**
     * Функция обновляет вакансию проекта.
     * @returns - Данные вакансии.
     */
    public async updateVacancyAsync(updateVacancyInput: VacancyInput) {
        return await this.http.put(API_URL.apiUrl + "/vacancies/vacancy", updateVacancyInput).pipe(
            tap(data => this.vacancy$.next(data))
        );
    };

    /**
     * Функция создает новую вакансию проекта и автоматически прикрепляет ее к нему.
     * @returns - Данные вакансии.
     */
    public async createProjectVacancyAsync(createProjectVacancyInput: CreateProjectVacancyInput) {
        return await this.http.post(API_URL.apiUrl + "/projects/vacancy", createProjectVacancyInput).pipe(
            tap(data => this.vacancy$.next(data))
        );
    };

    /**
    * Функция создает новую вакансию.
    * @returns - Данные вакансии.
    */
    public async loadCatalogVacanciesAsync() {
        return await this.http.get(API_URL.apiUrl + "/vacancies").pipe(
            tap(data => this.catalog$.next(data))
        );
    };

    /**
  // * Функция получает вакансию по ее Id.
   * @param vacancyId - Id вакансии.
  // * @returns - Данные вакансии.
  */
    public async getVacancyByIdAsync(vacancyId: number) {
        return await this.http.get(API_URL.apiUrl + "/vacancies/vacancy?vacancyId=" + vacancyId).pipe(
            tap(data => this.selectedVacancy$.next(data))
        );
    };

    /**
     * Функция фильтрует вакансии.
     * @returns - Список вакансий после фильтрации.
     */
    public async filterVacanciesAsync(filterVacancyInput: FilterVacancyInput) {
        return await this.http.get(VacancyApiBuilder.createVacanciesFilterApi(filterVacancyInput)).pipe(
            tap(data => this.catalog$.next(data))
        );
    };

    /**
     * Функция ищет вакансии по поисковому запросу.
     * @param searchText - Поисковая строка.
     * @returns - Список вакансий после поиска.
     */
     public async searchVacanciesAsync(searchText: string) {
        return await this.http.get(API_URL.apiUrl + "/vacancies/search?searchText=" + searchText).pipe(
            tap(data => this.catalog$.next(data))
        );
    };

    /**
     * Функция пагинации вакансий.
     * @param page - Номер страницы.
     * @returns - Список вакансий.
     */
     public async getVacanciesPaginationAsync(page: number) {
        return await this.http.get(API_URL.apiUrl + `/vacancies/pagination/${page + 1}`).pipe(
            tap(data => this.pagination$.next(data))
        );
    };
}