import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { API_URL } from 'src/app/core/core-urls/api-urls';
import { AccessModerationInput } from '../models/input/access-moderation-input';
import { ApproveProjectInput } from '../models/input/approve-project-input';
import { RejectProjectInput } from '../models/input/reject-project-input';

/**
 * Класс сервиса модерации.
 */
@Injectable()
export class ModerationService {
    public accessModeration$ = new BehaviorSubject<any>(null);
    public projectsModeration$ = new BehaviorSubject<any>(null);
    public projectModeration$ = new BehaviorSubject<any>(null);
    public approveProjectModeration$ = new BehaviorSubject<any>(null);
    public rejectProjectModeration$ = new BehaviorSubject<any>(null);

    constructor(private readonly http: HttpClient) {

    }

    /**
     * Функция првоеряет доступ пользователя к модерации.
     * @returns - Признак доступа к модерации.
     */
    public async checkAvailableUserRoleModerationAsync(accessModerationInput: AccessModerationInput) {
        return await this.http.post(API_URL.apiUrl + "/moderation/check", accessModerationInput).pipe(
            tap(data => this.accessModeration$.next(data))
        );
    };

    /**
     * Функция получает список проектов для модерации.
     * @returns - Список проектов.
     */
     public async getProjectsModerationAsync() {
        return await this.http.get(API_URL.apiUrl + "/moderation/projects").pipe(
            tap(data => this.projectsModeration$.next(data))
        );
    };

    /**
     * Функция получает проект для просмотра модератором.
     * @param projectId - Id проекта.
     * @returns - Данные проекта.
     */
     public async previewProjectAsync(projectId: number) {
        return await this.http.get(API_URL.apiUrl + `/moderation/project/${projectId}/preview`).pipe(
            tap(data => this.projectModeration$.next(data))
        );
    };

    /**
     * Функция одобряет проект.
     * @param projectId - Id проекта.
     * @returns - Данные проекта.
     */
     public async approveProjectAsync(approveProjectInput: ApproveProjectInput) {
        return await this.http.patch(API_URL.apiUrl + `/moderation/project/approve`, approveProjectInput).pipe(
            tap(data => this.approveProjectModeration$.next(data))
        );
    };

    /**
     * Функция отклоняет проект.
     * @param projectId - Id проекта.
     * @returns - Данные проекта.
     */
     public async rejectProjectAsync(rejectProjectInput: RejectProjectInput) {
        return await this.http.patch(API_URL.apiUrl + `/moderation/project/reject`, rejectProjectInput).pipe(
            tap(data => this.rejectProjectModeration$.next(data))
        );
    };
}