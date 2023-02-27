import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { API_URL } from 'src/app/core/core-urls/api-urls';

/**
 * Класс сервиса уведомлений пользователя.
 */
@Injectable()
export class NotificationsService {
    public userNotifications$ = new BehaviorSubject<any>(null);

    constructor(private readonly http: HttpClient) {

    }

    /**
     * Функция получает список уведомлений пользователя.
     * @returns - Список уведомлений.
     */
    public async getUserNotificationsAsync() {
        return await this.http.get(API_URL.apiUrl + "/notifications").pipe(
            tap(data => this.userNotifications$.next(data))
        );
    };
}