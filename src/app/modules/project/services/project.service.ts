import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { API_URL } from 'src/app/core/core-urls/api-urls';
import { AttachProjectVacancyInput } from '../detail/models/input/attach-project-vacancy-input';
import { UpdateProjectInput } from '../detail/models/input/update-project-input';

/**
 * Класс сервиса проектов.
 */
@Injectable()
export class ProjectService {
    public catalog$ = new BehaviorSubject<any>(null);
    public selectedProject$ = new BehaviorSubject<any>(null);
    public projectStages$ = new BehaviorSubject<any>(null);
    public projectVacancies$ = new BehaviorSubject<any>(null);
    public projectVacanciesColumns$ = new BehaviorSubject<any>(null);
    public availableAttachVacancies$ = new BehaviorSubject<any>(null);    

    constructor(private readonly http: HttpClient) {

    }

    /**
    * Функция получает список проектов каталога.
    * @returns - Список проектов каталога.
    */
    public async loadCatalogProjectsAsync() {
        return await this.http.get(API_URL.apiUrl + "/projects").pipe(
            tap(data => this.catalog$.next(data))
        );
    };

    /**
    * Функция получает проект для изменения или просмотра.
     * @param projectId - Id проекта.
     * @param mode - Режим. Чтение или изменение.
    * @returns - Данные проекта.
    */
     public async getProjectAsync(projectId: number, mode: string) {
        return await this.http.get(API_URL.apiUrl + "/projects/project?projectId=" + projectId + "&mode=" + mode).pipe(
            tap(data => this.selectedProject$.next(data))
        );
    };

    /**
     * Функция обновляет проект.
     * @param model - Входная модель.
     * @returns - Обновленные данные проекта.
     */
    public async updateProjectAsync(model: UpdateProjectInput) {
        return await this.http.put(API_URL.apiUrl + "/projects/project", model).pipe(
            tap(data => this.selectedProject$.next(data))
        );
    };

    /**
     * Функция получает список стадий проекта.
     * @returns - Список стадий проекта.
     */
    public async getProjectStagesAsync() {
        return await this.http.get(API_URL.apiUrl + "/projects/stages").pipe(
            tap(data => this.projectStages$.next(data))
        );
    };

    /**
     * Функция получает список вакансий проекта.
     * @param projectId - Id проекта.
     * @returns - Список вакансий проекта.
     */
     public async getProjectVacanciesAsync(projectId: number) {
        return await this.http.get(API_URL.apiUrl + "/projects/vacancies?projectId=" + projectId).pipe(
            tap(data => this.projectVacancies$.next(data))
        );
    };

    /**
    // * Функция получает поля таблицы вакансий проектов пользователя.
    // * @returns - Список полей.
    */
    public async getProjectVacanciesColumnNamesAsync() {
        return await this.http.get(API_URL.apiUrl + "/vacancies/config-user-vacancies").pipe(
            tap(data => this.projectVacanciesColumns$.next(data))
        );
    };

    /**
    // * Функция получает список вакансий пользователя, которые можно прикрепить к проекту
    // * @returns - Список вакансий.
    */
    public async getAvailableAttachVacanciesAsync(projectId: number) {
        return await this.http.get(API_URL.apiUrl + "/projects/available-attach-vacancies?projectId=" + projectId).pipe(
            tap(data => this.availableAttachVacancies$.next(data))
        );
    };

    /**
     * Функция прикрепляет вакансию к проекту.
     * @param attachModel - Входная модель.
     */
    public async attachProjectVacancyAsync(attachModel: AttachProjectVacancyInput) {
        return await this.http.post(API_URL.apiUrl + "/projects/attach-vacancy", attachModel)
        // .pipe(
        //     tap(data => this.availableAttachVacancies$.next(data))
        // );
    };   
}