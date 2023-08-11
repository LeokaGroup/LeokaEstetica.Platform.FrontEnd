import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BehaviorSubject, tap} from 'rxjs';
import {API_URL} from 'src/app/core/core-urls/api-urls';
import {ProfileInfoInput} from '../aboutme/models/input/profile-info-input';
import {SelectMenuInput} from '../left-menu/models/input/select-menu-input';
import {CreateProjectInput} from '../project/create-project/models/input/create-project-input';
import { PreRestoreInput } from '../restore/models/pre-restore-input';
import { RestoreInput } from '../restore/models/restore-input';

/**
 * Класс компонента профиля пользователя.
 */
@Injectable()
export class BackOfficeService {
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
  public listVacancy$ = new BehaviorSubject<any>([]);
  public deleteVacancy$ = new BehaviorSubject<any>(null);
  public resumeRemarks$ = new BehaviorSubject<any>(null);
  public userOrders$ = new BehaviorSubject<any>([]);
  public orderDetails$ = new BehaviorSubject<any>([]);
  public histories$ = new BehaviorSubject<any>([]);
  public archivedVacancy$ = new BehaviorSubject<any>(null);
  public archivedProject$ = new BehaviorSubject<any>(null);
  public archivedProjects$ = new BehaviorSubject<any>([]);
  public archivedVacancies$ = new BehaviorSubject<any>([]);
  public deleteVacancyArchive$ = new BehaviorSubject<any>(null);
  public deleteProjectArchive$ = new BehaviorSubject<any>(null);
  public sendedRestoreCode$ = new BehaviorSubject<any>(null);
  public checkSednedRestoreCode$ = new BehaviorSubject<any>(null);
  public restorePassword$ = new BehaviorSubject<any>(null);
  public inviteTelegramLink$ = new BehaviorSubject<any>(null);

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
   * Функция получает данные анкеты выбранного в базе резюме пользователя для просмотра.
   * @returns - Данные обо мне.
   */
  public async getSelectedProfileInfoAsync(profileInfoId: number) {
    return await this.http.get(API_URL.apiUrl + `/resumes/${profileInfoId}`).pipe(
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

  /**
   * Функция получает список вакансий пользователя.
   * @returns Список вакансий.
   */
  public async getUserVacancysAsync() {
    return await this.http.get(API_URL.apiUrl + "/vacancies/user-vacancies").pipe(
      tap(data => this.listVacancy$.next(data))
    );
  };

  /**
   * Функция удаляет вакансию.
   * @param vacancyId - Id вакансии.
   */
  public async deleteVacancyAsync(vacancyId: number) {
    return await this.http.delete(API_URL.apiUrl + `/vacancies/${vacancyId}`).pipe(
      tap(data => this.deleteVacancy$.next(data))
    );
  };

  /**
   * Функция получает список замечаний анкеты.
   * @returns - Список замечаний анкеты.
   */
  public async getResumesRemarksAsync() {
    return await this.http.get(API_URL.apiUrl + `/resumes/remarks`).pipe(
      tap(data => this.resumeRemarks$.next(data))
    );
  };

  /**
   * Функция получает список заказов пользователя.
   * @returns - Список заказов пользователя.
   */
  public async getUserOrdersAsync() {
    return await this.http.get(API_URL.apiUrl + `/orders/all`).pipe(
      tap(data => this.userOrders$.next(data))
    );
  };

  /**
   * Функция получает детали заказа по его Id.
   * @returns - Детали заказа.
   */
  public async getOrderDetailsAsync(orderId: number) {
    return await this.http.get(API_URL.apiUrl + `/orders/details?orderId=${orderId}`).pipe(
      tap(data => this.orderDetails$.next(data))
    );
  };

  /**
   * Функция получает список транзакций по заказам пользователя.
   * @returns - Список транзакций.
   */
  public async getHistoriesAsync() {
    return await this.http.get(API_URL.apiUrl + "/orders/history").pipe(
      tap(data => this.histories$.next(data))
    );
  };  

   /**
     * Функция получает список проектов в архиве.
     * @returns Список проектов.
     */
   public async getProjectsArchiveAsync() {
    return await this.http.get(API_URL.apiUrl + "/projects/archive").pipe(
      tap(data => this.archivedProjects$.next(data))
    );
  };

  /**
     * Функция получает список вакансий в архиве.
     * @returns Список вакансий.
     */
   public async getVacanciesArchiveAsync() {
    return await this.http.get(API_URL.apiUrl + "/vacancies/archive").pipe(
      tap(data => this.archivedVacancies$.next(data))
    );
  };

    /**
     * Функция удаляет проект из архива.
     * @param projectId - Id проекта.
     */
    public async deleteProjectArchiveAsync(projectId: number) {
      return await this.http.delete(API_URL.apiUrl + `/projects/archive?projectId=${projectId}`).pipe(
        tap(data => this.deleteProjectArchive$.next(data))
      );
    };

     /**
     * Функция удаляет вакансию из архива.
     * @param vacancyId - Id вакансии.
     */
      public async deleteVacancyArchiveAsync(vacancyId: number) {
        return await this.http.delete(API_URL.apiUrl + `/vacancies/archive/${vacancyId}`).pipe(
          tap(data => this.deleteVacancyArchive$.next(data))
        );
      };

  /**
 * Функция отправляет ссылку на почту пользователю с дальнейшими инструкциями.
 * @param preRestoreInput - Входная модель.
 */
  public async sendCodeRestorePasswordAsync(preRestoreInput: PreRestoreInput) {
    return await this.http.post(API_URL.apiUrl + "/user/pre-restore", preRestoreInput).pipe(
      tap(data => this.sendedRestoreCode$.next(data))
    );
  };
      
  /**
     * Функция проверяет переход по ссылке восстановления пароля.
     @returns - Признак результата проверки.
     */
   public async checkRestorePasswordLinkAsync(publicKey: string) {
    return await this.http.get(API_URL.apiUrl + `/user/restore/check?publicKey=${publicKey}`).pipe(
      tap(data => this.checkSednedRestoreCode$.next(data))
    );
  };

  /**
     * Функция восстанавливает пароль.
     * @param restoreInput - Входная модель.
     */
     public async restorePasswordAsync(restoreInput: RestoreInput) {
      return await this.http.post(API_URL.apiUrl + "/user/restore", restoreInput).pipe(
        tap(data => this.restorePassword$.next(data))
      );
    };

     /**
     * Функция получает ссылку для инвайта в канал телеграма.
     */
      public async createInviteLinkTelegramAsync() {
        return await this.http.get(API_URL.apiUrl + "/telegram/invite").pipe(
          tap(data => this.inviteTelegramLink$.next(data))
        );
      };
}
