import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { NavigationStart, Router, Event as NavigationEvent, ActivatedRoute } from "@angular/router";
import { NetworkService } from './core/interceptors/network.service';
import {API_URL} from "./core/core-urls/api-urls";
import {HttpTransportType, HubConnection, HubConnectionBuilder} from "@microsoft/signalr";
import {RedisService} from "./modules/redis/services/redis.service";
import {DialogInput} from "./modules/messages/chat/models/input/dialog-input";
import { BehaviorSubject } from 'rxjs';
import {MessageService} from "primeng/api";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public loading$ = this.networkService.loading$;
  public readonly checkUserCode$ = this._redisService.checkUserCode$;


  public isVisibleMenu: boolean = false;
  private _aVisibleProfileMenuRoutes: string[] = [
    "/profile/aboutme?mode=view",
    "/profile/aboutme?mode=edit",
    "/profile/projects/my",
    "/profile/projects/create",
    "/vacancies",
    "/projects/project?projectId",
    "/subscriptions"
  ];

  private _aVisibleVacancyMenuRoutes: string[] = [
    "/vacancies",
    "/vacancies/create"
  ];

  private projectModeUrls = [
    "/projects/project?projectId",
    "/projects"
  ];

  private resumeModeUrls = [
    "/resumes"
  ];
  counter: number = 0;
  currentUrl: string = "";
  isVisibleHeader: boolean = false;
  isVisibleProjectManagementMenu: boolean = false;
  hubConnection: any;

  // Для добавления нового метода хаба, достаточно просто добавить в массив название метода на бэке.
  aHubOnMethods: string[] = [
    // Уведомления сохранения профиля пользователя.
    "SendNotifySuccessSave",

    // Уведомления предупреждения о навыках.
    "SendNotificationWarningSaveUserSkills",

    // Уведомления предупреждения о целях пользователя.
    "SendNotificationWarningSaveUserIntents",

    // Уведомления создания проекта пользователя.
    "SendNotificationSuccessCreatedUserProject",

    // Уведомления создания вакансии пользователя.
    "SendNotificationSuccessCreatedUserVacancy",

    // Уведомления обновления проекта пользователя.
    "SendNotificationSuccessUpdatedUserProject",

    // Уведомления прикрепления вакансии проекта.
    "SendNotificationSuccessAttachProjectVacancy",

    // Уведомления дубликата прикрепления вакансии проекта.
    "SendNotificationErrorDublicateAttachProjectVacancy",

    // Уведомления об отклике на проект.
    "SendNotificationSuccessProjectResponse",

    // Уведомления о предупреждении отклика на проект.
    "SendNotificationWarningProjectResponse",

    // Уведомления успешного удаления проекта.
    "SendNotificationSuccessDeleteProject",

    // Уведомления успешного удаления вакансии проекта.
    "SendNotificationSuccessDeleteProjectVacancy",

    // Уведомления ошибки удаления вакансии проекта.
    "SendNotificationErrorDeleteProjectVacancy",

    // Уведомления успешного удаления вакансии из раздела мои вакансии.
    "SendNotificationSuccessDeleteVacancy",

    // Уведомления ошибки удаления вакансии из раздела мои вакансии.
    "SendNotificationErrorDeleteVacancy",

    // Уведомления предупреждения о инвайте в проект.
    "SendNotificationWarningProjectInviteTeam",

    // Уведомления предупреждения о блокировке пользователя.
    "SendNotificationWarningBlockedUser",

    // Уведомления предупреждения не заполненной анкеты пользователя.
    "SendNotificationWarningEmptyUserProfile",

    // Уведомления предупреждения о приглашенном пользователе в команду проекта.
    "SendNotificationWarningUserAlreadyProjectInvitedTeam",

    // Уведомления предупреждения о приглашенном пользователе в команде проекта.
    "SendNotificationSuccessUserProjectInvitedTeam",

    // Уведомления предупреждения о приглашенном пользователе в команде проекта.
    "SendNotificationSuccessUserProjectInvitedTeam",

    // Уведомления предупреждения о исключении пользователя из команды проекта.
    "SendNotificationSuccessDeleteProjectTeamMember",

    // Уведомления предупреждения об успешном сохранении замечаний проекта.
    "SendNotificationSuccessCreateProjectRemarks",

    // Уведомления предупреждения об успешной отправке замечаний проекта.
    "SendNotificationSuccessSendProjectRemarks",

    // Уведомления предупреждения о внесении замечаний проекта.
    "SendNotificationWarningSendProjectRemarks",

    // Уведомления успеха о внесении замечаний вакансии.
    "SendNotificationSuccessCreateVacancyRemarks",

    // Уведомления успеха о отправке замечаний вакансии.
    "SendNotificationSuccessSendVacancyRemarks",

    // Уведомления предупреждения о отправке замечаний вакансии.
    "SendNotificationWarningSendVacancyRemarks",

    // Уведомления успеха о внесении замечаний анкеты.
    "SendNotificationSuccessCreateResumeRemarks",

    // Уведомления предупреждения о отправке замечаний анкеты.
    "SendNotificationWarningSendResumeRemarks",

    // Уведомления успеха о отправке замечаний анкеты.
    "SendNotificationSuccessSendResumeRemarks",

    // Уведомления ошибки ошибки вычисления суммы возврата.
    "SendNotificationSuccessCalculateRefund",

    // Уведомления успешное добавление проекта в архив.
    "SendNotificationSuccessAddProjectArchive",

    // Уведомления ошибки добавление проекта в архив.
    "SendNotificationErrorAddProjectArchive",

    // Уведомления предупреждения о добавленном проекте в архив.
    "SendNotificationWarningAddProjectArchive",

    // Уведомления успешное добавление вакансии в архив.
    "SendNotificationSuccessAddVacancyArchive",

    // Уведомления ошибки добавление вакансии в архив.
    "SendNotificationErrorAddVacancyArchive",

    // Уведомления предупреждения о добавленной вакансии в архив.
    "SendNotificationWarningAddVacancyArchive",

    // Уведомления успешного удаления проекта из архива.
    "SendNotificationSuccessDeleteProjectArchive",

    // Уведомления успешного удаления вакансии из архива.
    "SendNotificationSuccessDeleteVacancyArchive",

    // Уведомления предупреждения о блокировке аккаунта.
    "SendNotificationWarningBlockedUserProfile",

    // Уведомления успеха при отправке ссылки для восстановления пароля.
    "SendNotificationSuccessLinkRestoreUserPassword",

    // Уведомления успеха при восстановлении пароля.
    "SendNotifySuccessRestoreUserPassword",

    // Уведомления ошибки при удалении вакансии из архива.
    "SendNotificationErrorDeleteVacancyArchive",

    // Уведомления ошибки при удалении проекта из архива.
    "SendNotificationWarningDeleteProjectArchive",

    // Уведомления ошибки при удалении вакансии из архива.
    "SendNotificationWarningDeleteVacancyArchive",

    // Уведомления предупреждения о лимите кол-ва проектов при создании проекта.
    "SendNotificationWarningLimitFareRuleProjects",

    // Уведомления получения диалогов проекта.
    "listenGetProjectDialogs",

    // Получение диалога проекта.
    "listenGetDialog",

    // Отправку сообщений.
    "listenSendMessage",

    // Получение диалогов ЛК.
    "listenProfileDialogs",

    // Предупреждение при поиске пользователя для приглашения в проект.
    "SendNotificationWarningSearchProjectTeamMember",

    // Успешную запись комментария к проекту.
    "SendNotificationSuccessCreatedCommentProject",

    // Успешное создание возврата.
    "SendNotificationSuccessManualRefund",

    // Предупреждения создание возврата при дубликате.
    "SendNotificationWarningManualRefund",

    // Уведомления об предупреждении лимите вакансий по тарифу.
    "SendNotificationWarningLimitFareRuleVacancies",

    // Уведомления ошибки при создании вакансии.
    "SendNotificationErrorCreatedUserVacancy",

    // Уведомления успешного планирования спринта.
    "SendNotifySuccessPlaningSprint",

    // Уведомления успешного планирования эпика.
    "SendNotifySuccessIncludeEpicTask",

    // Уведомления ошибки планирования эпика.
    "SendNotifyErrorIncludeEpicTask",

    // Уведомление об успешном начале спринта.
    "SendNotificationSuccessStartSprint",

    // Уведомление об успешном начале спринта.
    "SendNotificationWarningStartSprint",

    // Диалоги с нейросетью Scrum Master AI.
    "listenGetDialogs",

    // Получение диалога нейросети.
    "listenGetDialog",

    // Отправка сообщений.
    "listenSendMessage",

    // Ответы нейросети.
    "SendClassificationNetworkMessageResult",

    // Уведомление о предупреждении невозможности изменения статуса эпика на недопустимый статус.
    "SendNotifyWarningChangeEpicStatus",

    // Уведомление о предупреждении невозможности изменения статуса истории на недопустимый статус.
    "SendNotifyWarningChangeStoryStatus",

    // Уведомление об успешном обновлении ролей.
    "SendNotifySuccessUpdateRoles",

    // Уведомление о дубликате проекта.
    "SendNotificationWarningDublicateUserProject"
  ];

  public $allFeed: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  aMessages: any[] = [];
    aDialogs: any[] = [];
    lastMessage: any;
    dialogId: number = 0;
    message: string = "";
    projectId: number = 0;

  constructor(public networkService: NetworkService,
              private readonly _router: Router,
              private readonly _activatedRoute: ActivatedRoute,
              private changeDetectorRef: ChangeDetectorRef,
              private readonly _redisService: RedisService,
              private readonly _messageService: MessageService) {

  }

  public async ngOnInit() {
    this.checkCurrentRouteUrl();
    this.isVisibleHeader = true;

    // Настраиваем хабы для работы уведомлений SignalR.
    await this.configureHubsAsync();
  };

  public get AllFeedObservable() {
    return this.$allFeed;
  };

  private listenAllHubsNotifications() {
    this.aHubOnMethods.forEach((method: any) => {
      (<HubConnection>this.hubConnection).on(method, (response: any) => {
        this.$allFeed.next(response);
      });
    });
  };

  public rerender(): void {
    this.isVisibleMenu = false;
    this.changeDetectorRef.detectChanges();
    this.isVisibleMenu = true;
};

  /**
   * Функция проверяет текущий роут.
   */
  private checkCurrentRouteUrl() {
    this._router.events
      .subscribe(
        (event: NavigationEvent) => {
          if (event instanceof NavigationStart) {
            console.log(event.url);
            this.checkRoutes(event.url);

            if (this.currentUrl == "/") {
              this.isVisibleMenu = false;
            }

            if (this.currentUrl == "/forbidden") {
              this.isVisibleMenu = false;
            }
          }
        });
  };

  /**
   * Функция проверяет видимости контролов в зависимости от роутов.
   * @param currentUrl - Текущий роут.
   */
  private checkRoutes(currentUrl: string) {
    this.currentUrl = currentUrl;
    this.rerender();

    if (currentUrl == "forbidden") {
      this.isVisibleMenu = false;
    }

    // Отображение левого меню профиля пользователя.
    if (this._aVisibleProfileMenuRoutes.includes(currentUrl)) {
      this.isVisibleMenu = true;
      localStorage["m_t"] = 1;
    }

    if (this._aVisibleVacancyMenuRoutes.includes(currentUrl)) {
      localStorage["m_t"] = 1;
      this.isVisibleMenu = true;
    }

    if (this.projectModeUrls.includes(currentUrl)
    || this.resumeModeUrls.includes(currentUrl)) {
      this.isVisibleMenu = true;
      localStorage["m_t"] = 1;
    }

    if (currentUrl.indexOf("projectId") > 0) {
      this.rerender();
      this.isVisibleMenu = true;
    }

    if (currentUrl.indexOf("user/signin") >= 0) {
      this.rerender();
      this.isVisibleMenu = false;
    }

    if (currentUrl.indexOf("profile/aboutme?mode=view") >= 0) {
      this.rerender();
    }

    if (currentUrl.indexOf("/") >= 0) {
      this.rerender();
    }

    if (currentUrl.indexOf("callcenter") >= 0) {
      this.isVisibleMenu = false;
    }

    if (currentUrl.indexOf("press/offer") >= 0) {
      this.isVisibleMenu = false;
    }

    if (currentUrl.indexOf("project-management") >= 0) {
      this.isVisibleProjectManagementMenu = true;
      this.isVisibleMenu = false;
    }

    if (currentUrl === "/") {
      this.isVisibleProjectManagementMenu = false;
    }

    this._activatedRoute.queryParams
      .subscribe(params => {
        // Для просмотра анкеты другого пользователя.
        if (params["uc"] !== null && params["uc"] !== undefined) {
          this.isVisibleMenu = true;
        }

        // Для просмотра проекта.
        if (params["projectId"] > 0 && params["mode"] == "view") {
          this.isVisibleMenu = true;
        }

        if (params["page"]) {
          this.isVisibleMenu = true;
        }

        if (currentUrl.indexOf("fare-rules") >= 0) {
          this.isVisibleMenu = false;
        }
      });
  };

  /**
   * Функция получает диалоги проекта.
   * @param projectId - Id проекта.
   */
  public getDialogsAsync(projectId: number | null) {
    <HubConnection>this.hubConnection.invoke("GetDialogsAsync", localStorage["u_e"], localStorage["t_n"], +projectId!)
      .catch((err: any) => {
        console.error(err);
      });
  };

  /**
   * Функция получает диалог проекта.
   * @param diaalogId - Id диалога.
   */
  public getDialogAsync(dialogInput: DialogInput) {
    <HubConnection>this.hubConnection.invoke("GetDialogAsync", localStorage["u_e"], localStorage["t_n"], JSON.stringify(dialogInput))
      .catch((err: any) => {
        console.error(err);
      });
  };

  /**
   * Функция отправляет сообщение.
   */
  public sendMessageAsync(message: string, dialogId: number) {
    <HubConnection>this.hubConnection.invoke("SendMessageAsync", message, dialogId, localStorage["u_e"], localStorage["t_n"], API_URL.apiUrl)
      .catch((err: any) => {
        console.error(err);
      });
  };

  /**
   * Функция получает диалоги ЛК.
   * @param projectId - Id проекта.
   */
  public getProfileDialogsAsync() {
    <HubConnection>this.hubConnection.invoke("GetProfileDialogsAsync", localStorage["u_e"], localStorage["t_n"])
      .catch((err: any) => {
        console.error(err);
      });
  };

  /**
   * Функция настраивает хабы для работы уведомлений SignalR.
   */
  private async configureHubsAsync() {
    if (this.currentUrl != "user/signin") {
      // Подписываемся на получение всех сообщений.
      this.AllFeedObservable
        .subscribe((response: any) => {
          console.log("Подписались на сообщения", response);

          // Если пришел тип уведомления, то просто показываем его.
          if (response.notificationLevel !== undefined) {
            this._messageService.add({ severity: response.notificationLevel, summary: response.title, detail: response.message });
          }

          if (response.actionType == "All") {
            console.log("Сообщения чата ЛК: ", response);
            this.aDialogs = response.dialogs;
            this.aMessages = response.dialogs;
          }

          else if (response.actionType == "Concrete") {
            console.log("Сообщения диалога: ", response.messages);
            this.aMessages = response.messages;
            let lastMessage = response.messages[response.messages.length - 1];
            this.lastMessage = lastMessage;

            // Делаем небольшую задержку, чтобы диалог успел открыться, прежде чем будем скролить к низу.
            setTimeout(() => {
              let block = document.getElementById("#idMessages");
              block!.scrollBy({
                left: 0, // На какое количество пикселей прокрутить вправо от текущей позиции.
                top: block!.scrollHeight, // На какое количество пикселей прокрутить вниз от текущей позиции.
                behavior: 'auto' // Определяет плавность прокрутки: 'auto' - мгновенно (по умолчанию), 'smooth' - плавно.
              });
            }, 1);
          }

          else if (response.actionType == "Message") {
            console.log("Сообщения диалога: ", this.aMessages);
            this.message = "";
            let dialogIdx = this.aDialogs.findIndex(el => el.dialogId == this.dialogId);
            let lastMessage = response.messages[response.messages.length - 1];
            this.lastMessage = lastMessage;
            this.aDialogs[dialogIdx].lastMessage = this.lastMessage.message;
            this.aMessages = response.messages;

            this.aMessages.forEach((msg: any) => {
              if (msg.userCode !== localStorage["u_c"]) {
                msg.isMyMessage = false;
              }
              else {
                msg.isMyMessage = true;
              }
            });

            setTimeout(() => {
              let block = document.getElementById("#idMessages");
              block!.scrollBy({
                left: 0, // На какое количество пикселей прокрутить вправо от текущей позиции.
                top: block!.scrollHeight, // На какое количество пикселей прокрутить вниз от текущей позиции.
                behavior: 'auto' // Определяет плавность прокрутки: 'auto' - мгновенно (по умолчанию), 'smooth' - плавно.
              });
            }, 1);
          }
        });

      let module: any;

      if (this.currentUrl.includes("project-management")) {
        module = "ProjectManagement";
      }

      else {
        module = "Main";
      }

      if (!module || !localStorage["u_c"]) {
        return;
      }

      (await this._redisService.checkConnectionIdCacheAsync(localStorage["u_c"], module))
        .subscribe((_: any) => {

          // В кэше нету, создаем новое подключение пользователя и кладем в кэш.
          let notifyType = module == "Main" ? "notify" : "project-management-notify";
          let notifyRoute = module == "Main" ? API_URL.apiUrl : API_URL.apiUrlProjectManagment;

          this.hubConnection = new HubConnectionBuilder()
            .withUrl(`${notifyRoute}/${notifyType}?userCode=${localStorage["u_c"]}&module=${module}`, HttpTransportType.LongPolling)
            .build();

          this.listenAllHubsNotifications();

          if (this.hubConnection.state != "Connected" && this.hubConnection.connectionId == null) {
            this.hubConnection.start().then(async () => {
              console.log("Соединение установлено");
              console.log("ConnectionId:", this.hubConnection.connectionId);
            })
              .catch((err: any) => {
                console.error(err);
              });
          }
        });
    }
  };
}
