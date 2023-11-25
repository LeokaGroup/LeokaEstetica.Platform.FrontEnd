import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { API_URL } from 'src/app/core/core-urls/api-urls';

/**
 * Класс сервиса модуля управления проектами.
 */
@Injectable()
export class ProjectManagmentService {
    public availableProjectManagment$ = new BehaviorSubject<any>(null);
    public userProjects$ = new BehaviorSubject<any>(null);
    public viewStrategies$ = new BehaviorSubject<any>(null);
    public headerItems$ = new BehaviorSubject<any>(null);

    apiUrl: any;

    constructor(private readonly _http: HttpClient) {
        // Если используем ендпоинты модуля УП.
        if (API_URL.apiUrlProjectManagment !== null && API_URL.apiUrlProjectManagment !== undefined) {
            this.apiUrl = API_URL.apiUrlProjectManagment;
        }

        // Если используем основные ендпоинты.
        else {
            this.apiUrl = API_URL.apiUrl
        }
    }

    /**
    * Функция проверяет доступность модуля УП.
    * @returns - Признак доступности модуля УП.
    */
    public async availableProjectManagmentAsync() {
        return await this._http.get(this.apiUrl + "/project-managment/config/is-available-project-managment").pipe(
            tap(data => this.availableProjectManagment$.next(data))
        );
    };

    /**
    * Функция получает список проектов пользователя.
    * @returns - Список проектов.
    */
    public async getUseProjectsAsync() {
        return await this._http.get(this.apiUrl + "/project-managment/user-projects").pipe(
            tap(data => this.userProjects$.next(data))
        );
    };

    /**
   * Функция получает список стратегий представления.
   * @returns - Список стратегий.
   */
    public async getViewStrategiesAsync() {
        return await this._http.get(this.apiUrl + "/project-managment/view-strategies").pipe(
            tap(data => this.viewStrategies$.next(data))
        );
    };

    /**
 * Функция получает список элементов меню хидера (верхнее меню).
 * @returns - Список элементов.
 */
    public async getHeaderItemsAsync() {
        return await this._http.get(this.apiUrl + "/project-managment/header").pipe(
            tap(data => this.headerItems$.next(data))
        );
    };
}
