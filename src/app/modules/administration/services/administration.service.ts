import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { API_URL } from 'src/app/core/core-urls/api-urls';

/**
 * Класс сервиса администрации.
 */
@Injectable()
export class AdministrationService {
    // public profileInfoData$ = new BehaviorSubject<any>(null);

    constructor(private readonly http: HttpClient) {

    }

    /**
     * Функция получает информацию о профиля для раздела обо мне.
     * @returns - Данные обо мне.
     */
    // public async getProfileInfoAsync() {
    //     return await this.http.get(API_URL.apiUrl + "/profile/info").pipe(
    //         tap(data => this.profileInfo$.next(data))
    //     );
    // };   
}