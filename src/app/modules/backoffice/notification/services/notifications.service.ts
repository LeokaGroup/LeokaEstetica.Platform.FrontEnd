import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { API_URL } from 'src/app/core/core-urls/api-urls';
import { ApproveProjectInviteInput } from '../models/input/approve-project-invite-input';
import { RejectProjectInviteInput } from '../models/input/reject-project-invite-input';

/**
 * Класс сервиса уведомлений пользователя.
 */
@Injectable()
export class NotificationsService {
    public userNotifications$ = new BehaviorSubject<any>(null);
    public approveInviteNotifications$ = new BehaviorSubject<any>(null);
    public rejectInviteNotifications$ = new BehaviorSubject<any>(null);
    public addConnectionId$ = new BehaviorSubject<any>([]);

    constructor(private readonly http: HttpClient) {

    }

    /**
     * Функция получает список уведомлений пользователя.
     * @returns - Список уведомлений.
     */
    public async getUserNotificationsAsync() {
        return await this.http.get(API_URL.apiUrl + "/notifications/all-notifications").pipe(
            tap(data => this.userNotifications$.next(data))
        );
    };

    /**
     * Функция подтверждает инвайт в проект.
     * @param approveProjectInviteInput - Входная модель.
     */
     public async approveProjectInviteAsync(approveProjectInviteInput: ApproveProjectInviteInput) {
        return await this.http.patch(API_URL.apiUrl + "/notifications/approve-project-invite", 
        approveProjectInviteInput).pipe(
            tap(data => this.approveInviteNotifications$.next(data))
        );
    };

    /**
     * Функция отклоняет инвайт в проект.
    * @param rejectProjectInviteInput - Входная модель.
     */
     public async rejectProjectInviteAsync(rejectProjectInviteInput: RejectProjectInviteInput) {
        return await this.http.patch(API_URL.apiUrl + "/notifications/reject-project-invite", 
        rejectProjectInviteInput).pipe(
            tap(data => this.rejectInviteNotifications$.next(data))
        );
    };
}