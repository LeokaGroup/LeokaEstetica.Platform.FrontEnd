import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { API_URL } from 'src/app/core/core-urls/api-urls';

/**
 * Класс сервиса проектов.
 */
@Injectable()
export class ProjectService {
    public catalog$ = new BehaviorSubject<any>(null);

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
}