import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { API_URL } from 'src/app/core/core-urls/api-urls';
import { ProfileInfoInput } from '../aboutme/models/input/profile-info-input';

/**
 * Класс сервиса профиля пользователя.
 */
@Injectable()
export class BackOfficeService {
    public profileInfoData$ = new BehaviorSubject<any>(null);
    public profileItems$ = new BehaviorSubject<any>([]);
    public profileSkillsItems$ = new BehaviorSubject<any>([]);
    public profileIntentsItems$ = new BehaviorSubject<any>([]);
    public profileInfo$ = new BehaviorSubject<any>([]);

    constructor(private readonly http: HttpClient) {

    }

    /**
     * Функция получает информацию о профиля для раздела обо мне.
     * @returns - Данные обо мне.
     */
    public async getProfileInfoAsync() {
        return await this.http.get(API_URL.apiUrl + "/profile/info").pipe(
            tap(data => this.profileInfo$.next(data)
            )
        );
    };   

    /**
     * Функция получает пункты меню профиля пользователя.
     * @returns Список меню.
     */
    public async getProfileItemsAsync() {
        return await this.http.get(API_URL.apiUrl + "/profile/menu").pipe(
            tap(data => this.profileItems$.next(data)
            )
        );
    };  

    /**
     * Функция получает список навыков пользователя для выбора.
     * @returns - Список навыков.
     */
    public async getProfileSkillsAsync() {
        return await this.http.get(API_URL.apiUrl + "/profile/skills").pipe(
            tap(data => this.profileSkillsItems$.next(data)
            )
        );
    }; 

    /**
     * Функция получает список целей на платформе для выбора пользователем.
     * @returns - Список целей.
     */
    public async getProfileIntentsAsync() {
        return await this.http.get(API_URL.apiUrl + "/profile/intents").pipe(
            tap(data => this.profileIntentsItems$.next(data)
            )
        );
    }; 

    /**
     * Функция создает входную модель для сохранения данных профиля пользователя.
     * @returns - Данные модели для сохранения.
     */
    public async saveProfileInfoAsync(profileInfoInput: ProfileInfoInput) {
        return await this.http.post(API_URL.apiUrl + "/profile/info", profileInfoInput).pipe(
            tap(data => this.profileInfo$.next(data)
            )
        );
    }; 
}