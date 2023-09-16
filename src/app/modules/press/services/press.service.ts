import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { API_URL } from 'src/app/core/core-urls/api-urls';

/**
 * Класс сервиса прессы.
 */
@Injectable()
export class PressService {
    public contacts$ = new BehaviorSubject<any>(null);

    constructor(private readonly http: HttpClient) {
        
    }

    /**
    * Функция получает список контактов.
    * @returns - Список контактов.
    */
    public async getContactsAsync() {
        return await this.http.get(API_URL.apiUrl + "/press/contacts").pipe(
            tap(data => this.contacts$.next(data))
        );
    };
}
