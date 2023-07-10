import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { API_URL } from 'src/app/core/core-urls/api-urls';

@Injectable()
export class LandingService {
    public fonData$ = new BehaviorSubject<any>(null);
    public platformOffers$ = new BehaviorSubject<any>([]);
    public timelines$ = new BehaviorSubject<any>([]);
    public knowledgeLanding$ = new BehaviorSubject<any>([]);
    public newUsers$ = new BehaviorSubject<any>([]);
    public lastProjectComments$ = new BehaviorSubject<any>([]);

    constructor(private readonly http: HttpClient) {

    }

    /**
     * Функция получает данные фона главного лендинга.
     * @returns - Данные фона.
     */
    public async getFonLandingStartAsync() {
        return await this.http.get(API_URL.apiUrl + "/landing/fon/start").pipe(
            tap(data => this.fonData$.next(data))
        );
    };

    /**
     * Функция получает данные предложений платформы.
     * @returns - Данные предложений платформы.
     */
    public async getPlatformOffersAsync() {
        return await this.http.get(API_URL.apiUrl + "/landing/offers").pipe(
            tap(data => this.platformOffers$.next(data))
        );
    };

     /**
     * Функция получает список таймлайнов.
     * @returns - Список таймлайнов.
     */
      public async getTimelinesAsync() {
        return await this.http.get(API_URL.apiUrl + "/landing/timelines").pipe(
            tap(data => this.timelines$.next(data))
        );
    };

    /**
     * Функция получает список частых вопросов.
     * @returns - Список частых вопросов.
     */
     public async getKnowledgeLandingAsync() {
        return await this.http.get(API_URL.apiUrl + "/knowledge/landing").pipe(
            tap(data => this.knowledgeLanding$.next(data))
        );
    };

    /**
     * Функция получает список новых пользователей.
     * @returns - Список новых пользователей.
     */
     public async getNewUsersAsync() {
        return await this.http.get(API_URL.apiUrl + "/metrics/new-users").pipe(
            tap(data => this.newUsers$.next(data))
        );
    };

    /**
     * Функция получает последние 5 комментариев к проектам.
     * Проекты не повторяются.
     * @returns - Список комментариев.
     */
     public async getLastProjectCommentsAsync() {
        return await this.http.get(API_URL.apiUrl + "/metrics/last-project-comments").pipe(
            tap(data => this.lastProjectComments$.next(data))
        );
    };
}