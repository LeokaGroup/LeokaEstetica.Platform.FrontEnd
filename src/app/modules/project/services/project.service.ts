import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { API_URL } from 'src/app/core/core-urls/api-urls';
import { ProjectApiBuilder } from 'src/app/core/url-builders/project-api-builder';
import { AddProjectArchiveInput } from '../../backoffice/models/input/project/add-project-archive-input';
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
    public availableInviteVacancies$ = new BehaviorSubject<any>(null);
    public projectResponse$ = new BehaviorSubject<any>(null);
    public createdProjectComment$ = new BehaviorSubject<any>(null);
    public projectComments$ = new BehaviorSubject<any>(null);
    public projectTeamColumns$ = new BehaviorSubject<any>(null);
    public projectTeam$ = new BehaviorSubject<any>(null);
    public invitedProjectTeamMember$ = new BehaviorSubject<any>(null);
    public pagination$ = new BehaviorSubject<any>(null);
    public removedProject$ = new BehaviorSubject<any>(null);
    public removedVacansyInProject$ = new BehaviorSubject<any>(null);
    public availableVacansiesResponse$ = new BehaviorSubject<any>(null);
    public deletedProjectTeamMember$ = new BehaviorSubject<any>(null);
    public leaveProjectTeamMember$ = new BehaviorSubject<any>(null);
    public projectRemarks$ = new BehaviorSubject<any>(null);
    public archivedProject$ = new BehaviorSubject<any>(null);

    constructor(private readonly http: HttpClient) {

    }

    /**
    * Функция получает список проектов каталога.
    * @returns - Список проектов каталога.
    */
    public async loadCatalogProjectsAsync() {
        return await this.http.get(API_URL.apiUrl + "/projects/catalog").pipe(
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
    // * Функция получает список вакансий пользователя, которые можно прикрепить к проекту
    // * @returns - Список вакансий.
    */
    public async getAvailableInviteVacanciesAsync(projectId: number) {
        return await this.http.get(API_URL.apiUrl + "/projects/available-invite-vacancies?projectId=" + projectId).pipe(
            tap(data => this.availableInviteVacancies$.next(data))
        );
    };

    /**
     * Функция прикрепляет вакансию к проекту.
     * @param attachModel - Входная модель.
     */
    public async attachProjectVacancyAsync(attachModel: AttachProjectVacancyInput) {
        return await this.http.post(API_URL.apiUrl + "/projects/attach-vacancy", attachModel)
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

    /**
     * Функция ищет проекты по поисковому запросу.
     * @param searchText - Поисковая строка.
     * @returns - Список проектов после поиска.
     */
     public async searchProjectsAsync(searchText: string) {
        return await this.http.get(API_URL.apiUrl + "/projects/search?searchText=" + searchText).pipe(
            tap(data => this.catalog$.next(data))
        );
    };

    /**
     * Функция пагинации проектов.
     * @param page - Номер страницы.
     * @returns - Список проектов.
     */
     public async getProjectsPaginationAsync(page: number) {
        // Надо инкрементить, так как event.page по дефолту имеет 0 для 1 элемента.
        return await this.http.get(API_URL.apiUrl + `/projects/pagination/${page + 1}`).pipe(
            tap(data => this.pagination$.next(data))
        );
    };

    /**
     * Функция удаляет проект.
     * @param projectId - Id проекта.
     */
     public async deleteProjectsAsync(projectId: number) {
        return await this.http.delete(API_URL.apiUrl + `/projects/${projectId}`).pipe(
            tap(data => this.removedProject$.next(data))
        );
    };

  /**
   * Функция удаляет выбранную вакансию проекта реализовал .
   */
  public async deleteVacancyInProjectAsync(projectId:number, vacancyId:number) {
    return await this.http.delete(API_URL.apiUrl + `/projects/projects/${projectId}/vacancies/${vacancyId}`).pipe(
      tap(data => this.removedVacansyInProject$.next(data))
    );
  };

  /**
   * Функция получает список вакансий доступных для отклика.
   */
   public async availableVacanciesProjectResponseAsync(projectId: number) {
    return await this.http.get(API_URL.apiUrl + `/projects/available-response-vacancies?projectId=${projectId}`).pipe(
      tap(data => this.availableVacansiesResponse$.next(data))
    );
  };

  /**
   * Функция удаляет пользователя из команды проекта.
   * @param projectId - Id проекта.
   * @param userId - Id участника проекта, которого будем удалять.
   */
  public async deleteProjectTeamAsync(projectId: number, userId: number) {
    return await this.http.delete(API_URL.apiUrl + `/projects/${projectId}/team-member/${userId}`).pipe(
        tap(data => this.deletedProjectTeamMember$.next(data))
      );
  };

   /**
   * Функция покидания из команды проекта.
   * @param projectId - Id проекта.
   */
    public async leaveProjectTeamAsync(projectId: number) {
        return await this.http.delete(API_URL.apiUrl + `/projects/team-leave/${projectId}`).pipe(
            tap(data => this.leaveProjectTeamMember$.next(data))
          );
      };

    /**
 * Функция получает список замечаний проекта.
 * @param projectId - Id проекта.
 * @returns - Список замечаний проекта.
 */
    public async getProjectRemarksAsync(projectId: number) {
        return await this.http.get(API_URL.apiUrl + `/projects/${projectId}/remarks`).pipe(
            tap(data => this.projectRemarks$.next(data))
          );
      };

    // /**
    //  * Функция добавляет проект в архив.
    //  * @param archiveInput - Входная модель.
    //  */
    public async addArchiveProjectAsync(archiveInput: AddProjectArchiveInput) {
        return await this.http.post(API_URL.apiUrl + "/projects/archive", archiveInput).pipe(
            tap(data => this.archivedProject$.next(data))
        );
    };

  /**
   * Функция назначает роль участнику команды проекта.
   * @param userId - Id пользователя.
   * @param role - Название роли.
   * @param projectId - Id проекта.
   */
  public async setProjectTeamMemberRoleAsync(userId: number, role: string, projectId: number) {
    return await this.http.patch(API_URL.apiUrl + `/projects/team-member-role?userId=${userId}&role=${role}&projectId=${projectId}`, {}).pipe(
      tap(_ => console.log("Роль успешно назначена"))
    );
  };

  /**
   * Функция задает видимость проекта.
   * @param projectId - Id проекта.
   * @param isPublic - видимость.
   */
  public async setVisibleProjectAsync(projectId: number, isPublic: boolean) {
    return await this.http.patch(API_URL.apiUrl + `/projects/visible-project?projectId=${projectId}&isPublic=${isPublic}`, {}).pipe(
      tap(_ => console.log("Видимость проекта успешно назначена"))
    );
  };
}
