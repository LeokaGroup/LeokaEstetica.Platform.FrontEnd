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

    constructor(private readonly http: HttpClient) {
        
    }

    /**
    * Функция проверяет доступность модуля УП.
    * @returns - Признак доступности модуля УП.
    */
    public async availableProjectManagmentAsync() {
        return await this.http.get(API_URL.apiUrl + "/project-managment/config/is-available-project-managment").pipe(
            tap(data => this.availableProjectManagment$.next(data))
        );
    };
}
