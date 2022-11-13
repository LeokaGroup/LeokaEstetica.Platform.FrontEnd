import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { API_URL } from 'src/app/core/core-urls/api-urls';
import { ProfileInfoInput } from '../aboutme/models/input/profile-info-input';
import { SelectMenuInput } from '../left-menu/models/input/select-menu-input';
import { CreateProjectInput } from '../project/create-project/models/input/create-project-input';

/**
 * Класс сервиса профиля пользователя.
 */
@Injectable()
export class BackOfficeService {
    public profileInfoData$ = new BehaviorSubject<any>(null);
    public profileItems$ = new BehaviorSubject<any>([]);
    public vacancyItems$ = new BehaviorSubject<any>([]);
    public profileSkillsItems$ = new BehaviorSubject<any>([]);
    public profileIntentsItems$ = new BehaviorSubject<any>([]);
    public profileInfo$ = new BehaviorSubject<any>([]);
    public selectMenu$ = new BehaviorSubject<any>({});
    public selectedSkillsItems$ = new BehaviorSubject<any>([]);
    public selectedIntentsItems$ = new BehaviorSubject<any>([]);
    public projectColumns$ = new BehaviorSubject<any>([]);
    public projectData$ = new BehaviorSubject<any>({});
    public userProjects$ = new BehaviorSubject<any>([]);

    constructor(private readonly http: HttpClient) {

    }

    /**
     * Функция получает информацию о профиля для раздела обо мне.
     * @returns - Данные обо мне.
     */
    public async getProfileInfoAsync() {
        return await this.http.get(API_URL.apiUrl + "/profile/info").pipe(
            tap(data => this.profileInfo$.next(data))
        );
    };   

    /**
     * Функция получает пункты меню профиля пользователя.
     * @returns Список меню.
     */
    public async getProfileItemsAsync() {
        return await this.http.get(API_URL.apiUrl + "/profile/menu").pipe(
            tap(data => this.profileItems$.next(data))
        );
    };  

    /**
     * Функция получает пункты меню вакансий.
     * @returns Список меню.
     */
     public async getVacancyItemsAsync() {
        return await this.http.get(API_URL.apiUrl + "/vacancies/menu").pipe(
            tap(data => this.vacancyItems$.next(data))
        );
    }; 

    /**
     * Функция получает список навыков пользователя для выбора.
     * @returns - Список навыков.
     */
    public async getProfileSkillsAsync() {
        return await this.http.get(API_URL.apiUrl + "/profile/skills").pipe(
            tap(data => this.profileSkillsItems$.next(data))
        );
    }; 

    /**
     * Функция получает список целей на платформе для выбора пользователем.
     * @returns - Список целей.
     */
    public async getProfileIntentsAsync() {
        return await this.http.get(API_URL.apiUrl + "/profile/intents").pipe(
            tap(data => this.profileIntentsItems$.next(data))
        );
    }; 

    /**
     * Функция создает входную модель для сохранения данных профиля пользователя.
     * @returns - Данные модели для сохранения.
     */
    public async saveProfileInfoAsync(profileInfoInput: ProfileInfoInput) {
        return await this.http.post(API_URL.apiUrl + "/profile/info", profileInfoInput).pipe(
            tap(data => this.profileInfo$.next(data))
        );
    }; 

     /**
     * Функция находит системное имя выбранного пункта меню.
     * @param text - Название пункта меню.
     * @returns - Системное имя выбранного пункта меню.
     */
      public async selectProfileMenuAsync(text: string) {
        let selectMenuInput = new SelectMenuInput();
        selectMenuInput.Text = text;

        return await this.http.post(API_URL.apiUrl + "/profile/select-menu", selectMenuInput).pipe(
            tap(data => this.selectMenu$.next(data))
        );
    }; 

    /**
     * Функция получает список выбранных навыков пользователя.
     * @returns - Список навыков.
     */
     public async getSelectedUserSkillsAsync() {
        return await this.http.get(API_URL.apiUrl + "/profile/selected-skills").pipe(
            tap(data => this.selectedSkillsItems$.next(data))
        );
    }; 

    /**
     * Функция получает список выбранных целей пользователя.
     * @returns - Список навыков.
     */
     public async getSelectedUserIntentsAsync() {
        return await this.http.get(API_URL.apiUrl + "/profile/selected-intents").pipe(
            tap(data => this.selectedIntentsItems$.next(data))
        );
    };

     /**
    // * Функция получает поля таблицы проектов пользователя.
    // * @returns - Список полей.
    */
    public async getProjectsColumnNamesAsync() {
        return await this.http.get(API_URL.apiUrl + "/projects/config-user-projects").pipe(
            tap(data => this.projectColumns$.next(data))
        );
    };

     /**
     * Функция создает новый проект пользователя.
     * @returns Данные проекта.
     */
    public async createProjectAsync(createProjectInput: CreateProjectInput) {
        return await this.http.post(API_URL.apiUrl + "/projects/project", createProjectInput).pipe(
            tap(data => this.projectData$.next(data))
        );
    };

     /**
     * Функция получает список проектов пользователя.
     * @returns Список проектов.
     */
    public async getUserProjectsAsync() {
        return await this.http.get(API_URL.apiUrl + "/projects/user-projects").pipe(
            tap(data => this.userProjects$.next(data))
        );
    };
}