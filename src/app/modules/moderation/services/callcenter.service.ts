import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { API_URL } from 'src/app/core/core-urls/api-urls';
import { ApproveProjectInput } from '../models/input/approve-project-input';
import { ApproveVacancyInput } from '../models/input/approve-vacancy-input';
import { RejectProjectInput } from '../models/input/reject-project-input';
import { RejectVacancyInput } from '../models/input/reject-vacancy-input';
import { ApproveResumeInput } from "../models/input/approve-resume-input";
import {RejectResumeInput} from "../models/input/reject-resume-input";
import { CreateProjectRemarksInput } from '../models/input/project-remark-input';
import { SendProjectRemarkInput } from '../models/input/send-project-remark-input';
import { CreateVacancyRemarksInput } from '../models/input/vacancy-remark-input';
import { SendVacancyRemarkInput } from '../models/input/send-vacancy-remark-input';
import { CreateResumeRemarksInput } from '../models/input/resume-remark-input';
import { SendResumeRemarkInput } from '../models/input/send-resume-remark-input';

/**
 * Класс сервиса КЦ.
 */
@Injectable()
export class CallCenterService {
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
    public projectRemarksModeration$ = new BehaviorSubject<any>(null);
    public vacancyRemarksModeration$ = new BehaviorSubject<any>(null);
    public resumeRemarksModeration$ = new BehaviorSubject<any>(null);
    public unShippedProjectRemarks$ = new BehaviorSubject<any>(null);
    public projectsRemarks$ = new BehaviorSubject<any>(null);
    public vacanciesRemarks$ = new BehaviorSubject<any>(null);
    public unShippedVacancyRemarks$ = new BehaviorSubject<any>(null);
    public unShippedResumeRemarks$ = new BehaviorSubject<any>(null);
    public resumesRemarks$ = new BehaviorSubject<any>(null);
    public awaitingCorrectionProjects$ = new BehaviorSubject<any>(null);
    public awaitingCorrectionVacancies$ = new BehaviorSubject<any>(null);

    constructor(private readonly http: HttpClient) {}

    /**
     * Функция првоеряет доступ пользователя к модерации.
     * @returns - Признак доступа к модерации.
     */
    public async checkAvailableUserRoleModerationAsync() {
        return await this.http.get(API_URL.apiUrl + "/callcenter/check").pipe(
            tap(data => this.accessModeration$.next(data))
        );
    };

    /**
     * Функция получает список проектов для модерации.
     * @returns - Список проектов.
     */
     public async getProjectsModerationAsync() {
        return await this.http.get(API_URL.apiUrl + "/callcenter/projects").pipe(
            tap(data => this.projectsModeration$.next(data))
        );
    };

    /**
     * Функция получает проект для просмотра модератором.
     * @param projectId - Id проекта.
     * @returns - Данные проекта.
     */
     public async previewProjectAsync(projectId: number) {
        return await this.http.get(API_URL.apiUrl + `/callcenter/project/${projectId}/preview`).pipe(
            tap(data => this.projectModeration$.next(data))
        );
    };

    /**
     * Функция одобряет проект.
     * @param projectId - Id проекта.
     * @returns - Данные проекта.
     */
     public async approveProjectAsync(approveProjectInput: ApproveProjectInput) {
        return await this.http.patch(API_URL.apiUrl + `/callcenter/project/approve`, approveProjectInput).pipe(
            tap(data => this.approveProjectModeration$.next(data))
        );
    };

    /**
     * Функция отклоняет проект.
     * @param projectId - Id проекта.
     * @returns - Данные проекта.
     */
     public async rejectProjectAsync(rejectProjectInput: RejectProjectInput) {
        return await this.http.patch(API_URL.apiUrl + `/callcenter/project/reject`, rejectProjectInput).pipe(
            tap(data => this.rejectProjectModeration$.next(data))
        );
    };

    /**
     * Функция получает список вакансий для модерации.
     * @returns - Список вакансий.
     */
     public async getVacanciesModerationAsync() {
        return await this.http.get(API_URL.apiUrl + "/callcenter/vacancies").pipe(
            tap(data => this.vacanciesModeration$.next(data))
        );
    };

    /**
     * Функция получает вакансию для просмотра модератором.
     * @param vacancyId - Id вакансии.
     * @returns - Данные вакансии.
     */
     public async previewVacancyAsync(vacancyId: number) {
        return await this.http.get(API_URL.apiUrl + `/callcenter/vacancy/${vacancyId}/preview`).pipe(
            tap(data => this.vacancyModeration$.next(data))
        );
    };

    /**
     * Функция одобряет вакансию.
     * @param approveVacancyInput - Входная модель.
     * @returns - Данные вакансии.
     */
     public async approveVacancyAsync(approveVacancyInput: ApproveVacancyInput) {
        return await this.http.patch(API_URL.apiUrl + `/callcenter/vacancy/approve`, approveVacancyInput).pipe(
            tap(data => this.approveVacancyModeration$.next(data))
        );
    };

    /**
     * Функция отклоняет вакансию.
     * @param rejectVacancyInput - Входная модель.
     * @returns - Данные вакансии.
     */
     public async rejectVacancyAsync(rejectVacancyInput: RejectVacancyInput) {
        return await this.http.patch(API_URL.apiUrl + `/callcenter/vacancy/reject`, rejectVacancyInput).pipe(
            tap(data => this.rejectVacancyModeration$.next(data))
        );
    };






    /**
     * Функция получает список анкет для модерации.
     * @returns - Список вакансий.
     */
    public async getResumesModerationAsync() {
      return await this.http.get(API_URL.apiUrl + "/callcenter/resumes").pipe(
        tap(data => this.resumesModeration$.next(data))
      );
    };
  /**
   * Функция получает анкету для просмотра модератором.
   * @param profileInfoId - Id вакансии.
   * @returns - Данные вакансии.
   */
  public async previewResumeAsync(profileInfoId: number) {
    return await this.http.get(API_URL.apiUrl + `/callcenter/resume/${profileInfoId}/preview`).pipe(
      tap(data => console.log(this.resumeModeration$.next(data)))
    );
  };

  /**
   * Функция одобряет анкету.
   * @param approveVacancyInput - Входная модель.
   * @returns - Данные вакансии.
   */
  public async approveResumeAsync(approveResumeInput: ApproveResumeInput) {
    return await this.http.patch(API_URL.apiUrl + `/callcenter/resume/approve`, approveResumeInput).pipe(
      tap(data => this.approveResumeModeration$.next(data))
    );
  };

  /**
   * Функция отклоняет анкету.
   * @param rejectVacancyInput - Входная модель.
   * @returns - Данные анкеты.
   */
  public async rejectResumeAsync(rejectResumeAsync: RejectResumeInput) {
    return await this.http.patch(API_URL.apiUrl + `/callcenter/resume/reject`, rejectResumeAsync).pipe(
      tap(data => this.rejectResumeModeration$.next(data))
    );
  };

  /**
   * Функция сохраняет замечания проекта.
   * @param createProjectRemarksInput - Входная модель.
   * @returns - Список замечаний проекта.
   */
   public async createProjectRemarks(createProjectRemarksInput: CreateProjectRemarksInput) {
    return await this.http.post(API_URL.apiUrl + `/callcenter/project-remarks`, createProjectRemarksInput).pipe(
      tap(data => this.projectRemarksModeration$.next(data))
    );
  };

  /**
   * Функция отправляет замечания проекта.
   * @param createProjectRemarksInput - Входная модель.
   */
   public async sendProjectRemarks(sendProjectRemarkInput: SendProjectRemarkInput) {
    return await this.http.patch(API_URL.apiUrl + `/callcenter/send-project-remarks`, sendProjectRemarkInput).pipe(
      tap(data => this.projectRemarksModeration$.next(data))
    );
  };

   /**
   * Функция сохраняет замечания вакансии.
   * @param createVacancyRemarksInput - Входная модель.
   * @returns - Список замечаний вакансии.
   */
    public async createVacancyRemarks(createVacancyRemarksInput: CreateVacancyRemarksInput) {
      return await this.http.post(API_URL.apiUrl + `/callcenter/vacancy-remarks`, createVacancyRemarksInput).pipe(
        tap(data => this.vacancyRemarksModeration$.next(data))
      );
    };

     /**
   * Функция отправляет замеpreviewчания вакансии.
   * @param createProjectRemarksInput - Входная модель.
   */
   public async sendVacancyRemarks(sendVacancyRemarkInput: SendVacancyRemarkInput) {
    return await this.http.patch(API_URL.apiUrl + `/callcenter/send-vacancy-remarks`, sendVacancyRemarkInput).pipe(
      tap(data => this.vacancyRemarksModeration$.next(data))
    );
  };

  /**
   * Функция сохраняет замечания анкеты.
   * @param createResumeRemarksInput - Входная модель.
   * @returns - Список замечаний анкеты.
   */
   public async createResumeRemarks(createResumeRemarksInput: CreateResumeRemarksInput) {
    return await this.http.post(API_URL.apiUrl + `/callcenter/resume-remarks`, createResumeRemarksInput).pipe(
      tap(data => this.resumeRemarksModeration$.next(data))
    );
  };

    /**
   * Функция отправляет замечания анкеты.
   * @param createResumeRemarksInput - Входная модель.
   */
     public async sendResumeRemarks(sendResumeRemarkInput: SendResumeRemarkInput) {
      return await this.http.patch(API_URL.apiUrl + `/callcenter/send-resume-remarks`, sendResumeRemarkInput).pipe(
        tap(data => this.resumeRemarksModeration$.next(data))
      );
    };

    /**
   * Функция получает анкеты (не отправленные).
   * @param projectId - Id проекта.
   * @returns - Список замечаний (не отправленные).
   */
     public async getProjectUnShippedRemarksAsync(projectId: number) {
      return await this.http.get(API_URL.apiUrl + `/callcenter/project/${projectId}/remarks/unshipped`).pipe(
        tap(data => this.unShippedProjectRemarks$.next(data))
      );
    };

  /**
 * Функция получает список проектов, которые имеют замечания.
 * @returns - Список проектов, которые имеют замечания.
 */
  public async getProjectUnShippedRemarksTableAsync() {
    return await this.http.get(API_URL.apiUrl + "/callcenter/projects/remarks/unshipped-table").pipe(
      tap(data => this.projectsRemarks$.next(data))
    );
  };

  /**
 * Функция получает список вакансий, которые имеют замечания.
 * @returns - Список вакансий, которые имеют замечания.
 */
  public async getVacanciesUnShippedRemarksTableAsync() {
    return await this.http.get(API_URL.apiUrl + "/callcenter/vacancies/remarks/unshipped-table").pipe(
      tap(data => this.vacanciesRemarks$.next(data))
    );
  };

  /**
* Функция получает список анкет, которые имеют замечания.
* @returns - Список анкет, которые имеют замечания.
*/
  public async getResumesUnShippedRemarksTableAsync() {
    return await this.http.get(API_URL.apiUrl + `/callcenter/profile/remarks/unshipped-table`).pipe(
      tap(data => this.resumesRemarks$.next(data))
    );
  };

  /**
   * Функция получает анкеты (не отправленные).
   * @param profileInfoId - Id анкеты.
   * @returns - Список замечаний (не отправленные).
   */
   public async getResumeUnShippedRemarksAsync(profileInfoId: number) {
    return await this.http.get(API_URL.apiUrl + `/callcenter/profile/${profileInfoId}/remarks/unshipped`).pipe(
      tap(data => this.unShippedResumeRemarks$.next(data))
    );
  };

  /**
   * Функция получает замечания вакансии (не отправленные).
   * @param projectId - Id вакансии.
   * @returns - Список замечаний (не отправленные).
   */
   public async getVacancyUnShippedRemarksAsync(vacancyId: number) {
    return await this.http.get(API_URL.apiUrl + `/callcenter/vacancy/${vacancyId}/remarks/unshipped`).pipe(
      tap(data => this.unShippedVacancyRemarks$.next(data))
    );
  };

  /**
   * Функция получает проекты, у которых есть неисправленные замечания.
   * @returns - Список проектов.
   */
   public async getAwaitingCorrectionProjectsAsync() {
    return await this.http.get(API_URL.apiUrl + "/callcenter/awaiting-correction/projects").pipe(
      tap(data => this.awaitingCorrectionProjects$.next(data))
    );
  };

  /**
   * Функция получает вакансии, у которых есть неисправленные замечания.
   * @returns - Список вакансий.
   */
   public async getAwaitingCorrectionVacanciesAsync() {
    return await this.http.get(API_URL.apiUrl + "/callcenter/awaiting-correction/vacancies").pipe(
      tap(data => this.awaitingCorrectionVacancies$.next(data))
    );
  };
}
