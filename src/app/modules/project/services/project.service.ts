import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { API_URL } from 'src/app/core/core-urls/api-urls';
import { ProjectApiBuilder } from 'src/app/core/url-builders/project-api-builder';
import { AttachProjectVacancyInput } from '../detail/models/input/attach-project-vacancy-input';
import { CreateProjectCommentInput } from '../detail/models/input/create-project-comment-input';
import { FilterProjectInput } from '../detail/models/input/filter-project-input';
import { InviteProjectTeamMemberInput } from '../detail/models/input/invite-project-team-member-input';
import { ProjectResponseInput } from '../detail/models/input/project-response-input';
import { UpdateProjectInput } from '../detail/models/input/update-project-input';

/**
 * Класс сервиса проектов.
 */
@Injectable()
export class ProjectService {
    public catalog$ = new BehaviorSubject<any>(null);
    public selectedProject$ = new BehaviorSubject<any>(null);
    public projectStages$ = new BehaviorSubject<any>(null);
    public projectVacancies$ = new BehaviorSubject<any>(null);
    public projectVacanciesColumns$ = new BehaviorSubject<any>(null);
    public availableAttachVacancies$ = new BehaviorSubject<any>(null);    
    public projectResponse$ = new BehaviorSubject<any>(null);    
    public createdProjectComment$ = new BehaviorSubject<any>(null);    
    public projectComments$ = new BehaviorSubject<any>(null);    
    public projectTeamColumns$ = new BehaviorSubject<any>(null);   
    public projectTeam$ = new BehaviorSubject<any>(null);    
    public invitedProjectTeamMember$ = new BehaviorSubject<any>(null);    

    constructor(private readonly http: HttpClient) {

    }

    /**
    * Функция получает список проектов каталога.
    * @returns - Список проектов каталога.
    */
    public async loadCatalogProjectsAsync() {
        return await this.http.get(API_URL.apiUrl + "/projects").pipe(
            tap(data => this.catalog$.next(data))
        );
    };

    /**
    * Функция получает проект для изменения или просмотра.
     * @param projectId - Id проекта.
     * @param mode - Режим. Чтение или изменение.
    * @returns - Данные проекта.
    */
     public async getProjectAsync(projectId: number, mode: string) {
        return await this.http.get(API_URL.apiUrl + "/projects/project?projectId=" + projectId + "&mode=" + mode).pipe(
            tap(data => this.selectedProject$.next(data))
        );
    };

    /**
     * Функция обновляет проект.
     * @param model - Входная модель.
     * @returns - Обновленные данные проекта.
     */
    public async updateProjectAsync(model: UpdateProjectInput) {
        return await this.http.put(API_URL.apiUrl + "/projects/project", model).pipe(
            tap(data => this.selectedProject$.next(data))
        );
    };

    /**
     * Функция получает список стадий проекта.
     * @returns - Список стадий проекта.
     */
    public async getProjectStagesAsync() {
        return await this.http.get(API_URL.apiUrl + "/projects/stages").pipe(
            tap(data => this.projectStages$.next(data))
        );
    };

    /**
     * Функция получает список вакансий проекта.
     * @param projectId - Id проекта.
     * @returns - Список вакансий проекта.
     */
     public async getProjectVacanciesAsync(projectId: number) {
        return await this.http.get(API_URL.apiUrl + "/projects/vacancies?projectId=" + projectId).pipe(
            tap(data => this.projectVacancies$.next(data))
        );
    };

    /**
    // * Функция получает поля таблицы вакансий проектов пользователя.
    // * @returns - Список полей.
    */
    public async getProjectVacanciesColumnNamesAsync() {
        return await this.http.get(API_URL.apiUrl + "/vacancies/config-user-vacancies").pipe(
            tap(data => this.projectVacanciesColumns$.next(data))
        );
    };

    /**
    // * Функция получает список вакансий пользователя, которые можно прикрепить к проекту
    // * @returns - Список вакансий.
    */
    public async getAvailableAttachVacanciesAsync(projectId: number) {
        return await this.http.get(API_URL.apiUrl + "/projects/available-attach-vacancies?projectId=" + projectId).pipe(
            tap(data => this.availableAttachVacancies$.next(data))
        );
    };

    /**
     * Функция прикрепляет вакансию к проекту.
     * @param attachModel - Входная модель.
     */
    public async attachProjectVacancyAsync(attachModel: AttachProjectVacancyInput) {
        return await this.http.post(API_URL.apiUrl + "/projects/attach-vacancy", attachModel)
        // .pipe(
        //     tap(data => this.availableAttachVacancies$.next(data))
        // );
    };   

    /**
     * Функция записывает отклик на проект.
     * Запись происходит либо с указанием вакансии либо без нее.
     * @param responseInput - Входная модель.
     * @returns - Данные отклика на проект.
     */
    public async writeProjectResponseAsync(responseInput: ProjectResponseInput) {
        return await this.http.post(API_URL.apiUrl + "/projects/response", responseInput).pipe(
            tap(data => this.projectResponse$.next(data))
        );
    };    
    
    /**
     * Функция создает комментарий к проекту.
     * @param createProjectCommentInput - Входная модель.
     */
     public async createProjectCommentAsync(createProjectCommentInput: CreateProjectCommentInput) {
        return await this.http.post(API_URL.apiUrl + "/projects/project/comment", createProjectCommentInput).pipe(
            tap(data => this.createdProjectComment$.next(data))
        );
    };    

    /**
     * Функция получает список комментариев к проекту.
     * @param commentId - Id проекта.
     */
     public async getProjectCommentsAsync(commentId: number) {
        return await this.http.get(API_URL.apiUrl + `/projects/comments/${commentId}`).pipe(
            tap(data => this.projectComments$.next(data))
        );
    };  

    /**
     * Функция получает названия столбцов команды проекта.
     * @returns - Названия столбцов команды проекта.
     */
     public async getProjectTeamColumnsNamesAsync() {
        return await this.http.get(API_URL.apiUrl + "/projects/config-project-team").pipe(
            tap(data => this.projectTeamColumns$.next(data))
        );
    }; 

    /**
     * Функция получает данные для таблицы команда проекта
     * @returns - Данные для таблицы команда проекта.
     */
    public async getProjectTeamAsync(projectId: number) {
        return await this.http.get(API_URL.apiUrl + `/projects/${projectId}/team`).pipe(
            tap(data => this.projectTeam$.next(data))
        );
    };

    /**
     * Функция добавляет пользователя в команду проекта.
     * @returns - Добавленный пользователь.
     */
     public async sendInviteProjectTeamAsync(inviteProjectTeamMemberInput: InviteProjectTeamMemberInput) {
        return await this.http.post(API_URL.apiUrl + "/projects/invite-project-team", inviteProjectTeamMemberInput).pipe(
            tap(data => this.invitedProjectTeamMember$.next(data))
        );
    };

    /**
     * Функция фильтрует проекты.
     * @returns - Список проектов после фильтрации.
     */
     public async filterProjectsAsync(filterProjectInput: FilterProjectInput) {
        return await this.http.get(ProjectApiBuilder.createProjectsFilterApi(filterProjectInput)).pipe(
            tap(data => this.catalog$.next(data))
        );
    };
}