import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { API_URL } from 'src/app/core/core-urls/api-urls';

/**
 * Класс сервиса подписок.
 */
@Injectable()
export class SubscriptionsService {
    public subscriptions$ = new BehaviorSubject<any>(null);

    constructor(private readonly http: HttpClient) {

    }

    /**
     * Функция получает список подписок.
     * @returns - Список подписок.
     */
    public async getSubscriptionsAsync() {
        return await this.http.get(API_URL.apiUrl + "/subscriptions/all-subscriptions").pipe(
            tap(data => this.subscriptions$.next(data))
        );
    };
}