import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { API_URL } from 'src/app/core/core-urls/api-urls';

@Injectable()
export class BackOfficeService {
    public profileInfoData$ = new BehaviorSubject<any>(null);
    public profileItems$ = new BehaviorSubject<any>([]);

    constructor(private readonly http: HttpClient) {

    }

    /**
     * Функция получает информацию о профиля для раздела обо мне.
     * @returns - Данные обо мне.
     */
    public async getProfileInfoAsync() {
        return await this.http.get(API_URL.apiUrl + "/profile/info").pipe(
            tap(data => this.profileInfoData$.next(data)
            )
        );
    };   

    public async getProfileItemsAsync() {
        return await this.http.get(API_URL.apiUrl + "/profile/menu").pipe(
            tap(data => this.profileItems$.next(data)
            )
        );
    };  
}