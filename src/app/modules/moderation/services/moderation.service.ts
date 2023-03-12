import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { API_URL } from 'src/app/core/core-urls/api-urls';
import { AccessModerationInput } from '../models/input/access-moderation-input';
import { ApproveProjectInput } from '../models/input/approve-project-input';
import { ApproveVacancyInput } from '../models/input/approve-vacancy-input';
import { RejectProjectInput } from '../models/input/reject-project-input';
import { RejectVacancyInput } from '../models/input/reject-vacancy-input';
import { ApproveResumeInput } from "../models/input/approve-resume-input";
import {RejectResumeInput} from "../models/input/reject-resume-input";

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
    public vacanciesModeration$ = new BehaviorSubject<any>(null);
    public vacancyModeration$ = new BehaviorSubject<any>(null);
    public approveVacancyModeration$ = new BehaviorSubject<any>(null);
    public rejectVacancyModeration$ = new BehaviorSubject<any>(null);

    public resumesModeration$ = new BehaviorSubject<any>(null);
    public resumeModeration$ = new BehaviorSubject<any>(null);
    public rejectResumeModeration$ = new BehaviorSubject<any>(null);
    public approveResumeModeration$ = new BehaviorSubject<any>(null);
    constructor(private readonly http: HttpClient) {}

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

    /**
     * Функция получает список вакансий для модерации.
     * @returns - Список вакансий.
     */
     public async getVacanciesModerationAsync() {
        return await this.http.get(API_URL.apiUrl + "/moderation/vacancies").pipe(
            tap(data => this.vacanciesModeration$.next(data))
        );
    };

    /**
     * Функция получает вакансию для просмотра модератором.
     * @param vacancyId - Id вакансии.
     * @returns - Данные вакансии.
     */
     public async previewVacancyAsync(vacancyId: number) {
        return await this.http.get(API_URL.apiUrl + `/moderation/vacancy/${vacancyId}/preview`).pipe(
            tap(data => this.vacancyModeration$.next(data))
        );
    };

    /**
     * Функция одобряет вакансию.
     * @param approveVacancyInput - Входная модель.
     * @returns - Данные вакансии.
     */
     public async approveVacancyAsync(approveVacancyInput: ApproveVacancyInput) {
        return await this.http.patch(API_URL.apiUrl + `/moderation/vacancy/approve`, approveVacancyInput).pipe(
            tap(data => this.approveVacancyModeration$.next(data))
        );
    };

    /**
     * Функция отклоняет вакансию.
     * @param rejectVacancyInput - Входная модель.
     * @returns - Данные вакансии.
     */
     public async rejectVacancyAsync(rejectVacancyInput: RejectVacancyInput) {
        return await this.http.patch(API_URL.apiUrl + `/moderation/vacancy/reject`, rejectVacancyInput).pipe(
            tap(data => this.rejectVacancyModeration$.next(data))
        );
    };






    /**
     * Функция получает список анкет для модерации.
     * @returns - Список вакансий.
     */
    public async getResumesModerationAsync() {
      return await this.http.get(API_URL.apiUrl + "/moderation/resumes").pipe(
        tap(data => this.resumesModeration$.next(data))
      );
    };
  /**
   * Функция получает анкету для просмотра модератором.
   * @param profileInfoId - Id вакансии.
   * @returns - Данные вакансии.
   */
  public async previewResumeAsync(profileInfoId: number) {
    return await this.http.get(API_URL.apiUrl + `/moderation/resume/${profileInfoId}/preview`).pipe(
      tap(data => console.log(this.resumeModeration$.next(data)))
    );
  };

  /**
   * Функция одобряет анкету.
   * @param approveVacancyInput - Входная модель.
   * @returns - Данные вакансии.
   */
  public async approveResumeAsync(approveResumeInput: ApproveResumeInput) {
    return await this.http.patch(API_URL.apiUrl + `/moderation/resume/approve`, approveResumeInput).pipe(
      tap(data => this.approveResumeModeration$.next(data))
    );
  };

  /**
   * Функция отклоняет анкету.
   * @param rejectVacancyInput - Входная модель.
   * @returns - Данные анкеты.
   */
  public async rejectResumeAsync(rejectResumeAsync: RejectResumeInput) {
    return await this.http.patch(API_URL.apiUrl + `/moderation/resume/reject`, rejectResumeAsync).pipe(
      tap(data => this.rejectResumeModeration$.next(data))
    );
  };



}
