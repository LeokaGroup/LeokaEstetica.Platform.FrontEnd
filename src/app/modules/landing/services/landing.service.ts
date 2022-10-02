import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { API_URL } from 'src/app/core/core-urls/api-urls';

@Injectable()
export class LandingService {
    public fonData$ = new BehaviorSubject<any>(null);

    constructor(private readonly http: HttpClient) {

    }

    /**
     * Функция получает данные фона главного лендинга.
     * @returns - Данные фона.
     */
    public async getFonLandingStartAsync() {
        return await this.http.get(API_URL.apiUrl + "/landing/fon/start").pipe(
            tap(data => this.fonData$.next(data)
            )
        );
    };
}