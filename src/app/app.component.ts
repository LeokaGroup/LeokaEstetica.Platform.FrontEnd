import {
  ChangeDetectorRef,
  Component, OnDestroy,
  OnInit
} from '@angular/core';
import {
  NavigationStart,
  Router,
  Event as NavigationEvent,
  ActivatedRoute
} from "@angular/router";
import { NetworkService } from './core/interceptors/network.service';
import {API_URL} from "./core/core-urls/api-urls";
import {HttpTransportType, HubConnection, HubConnectionBuilder, LogLevel} from "@microsoft/signalr";
import {RedisService} from "./modules/redis/services/redis.service";
import { BehaviorSubject, Subscription  } from 'rxjs';
import {MessageService} from "primeng/api";
import {CommunicationsServiceService} from "./modules/communications/services/communications.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  public loading$ = this._networkService.loading$;
  public readonly checkUserCode$ = this._redisService.checkUserCode$;

  public isVisibleMenu: boolean = false;
  private _aVisibleMenuRoutes: string[] = [
    "/profile/aboutme?mode=view",
    "/profile/aboutme?mode=edit",
    "/profile/projects/my",
    "/profile/projects/create",
    "/vacancies",
    "/projects/project?projectId",
    "/subscriptions",
    "/space/my"
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
  hubMainConnection: any;
  hubProjectManagementConnection: any;
  hubCommunicationsConnection: any;

  // Для добавления нового метода хаба, достаточно просто добавить в массив название метода на бэке.
  aHubOnMethods: string[] = [
    // успешное создание задачи.
    "SendNotifySuccessProjectTask",

    // успешное создание ошибки.
    "SendNotifyErrorProjectTask",

    // успешное создание истории.
    "SendNotifySuccessProjectStory",

    // успешное создание эпика.
    "SendNotifySuccessProjectEpic",

    "SendNotifySuccessSaveProfileInfo",
    "SendNotifyErrorSaveProfileInfo",

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

    // Уведомления при успешном создании анкеты.
    "SendNotificationSuccessCreateUser",

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

    // Уведомления ошибки удаления проекта из архива.
    "SendNotificationErrorDeleteProjectArchive",

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
    "SendNotificationWarningDublicateUserProject",

    //Уведомление об успешном создании тега проекта.
    "SendNotifySuccessCreateProjectTag",

    "SendNotifySuccessProjectTaskIncludeSprint",
    "SendNotifySuccessExcludeEpicTask",
    "SendNotifyErrorExcludeEpicTask",
    "SendNotifySuccessExcludeSprintTask",
    "SendNotifyErrorExcludeSprintTask",
    "SendNotifySuccessCreateFolder",
    "SendNotifySuccessCreatePage",
    "SendNotifyErrorCreateFolder",
    "SendNotifyErrorCreatePage",
    "SendNotificationWarningNotFoundUserByEmail"
  ];

  aHubCommunicationsOnMethods: [];

  public $allFeed = new BehaviorSubject<any>(null);

  aMessages: any[] = [];
  aDialogs: any[] = [];
  lastMessage: any;
  dialogId: number = 0;
  message: string = "";
  projectId: number = 0;
  isNotifyCompleted: boolean = false;
  currentRoute: string = "";
  routeSubscription: Subscription = new Subscription();

  constructor(private _networkService: NetworkService,
              private readonly _router: Router,
              private _changeDetectorRef: ChangeDetectorRef,
              private readonly _redisService: RedisService,
              private readonly _messageService: MessageService,
              private readonly _route: ActivatedRoute,
              private _communicationsService: CommunicationsServiceService) {
    this.aHubCommunicationsOnMethods = [];
  }

  public async ngOnInit() {
    this.checkUrlParams();
    this.checkCurrentRouteUrl();
    this.isVisibleHeader = true;

    this.routeSubscription = this._router.events.subscribe(async (event: any) => {
      if (event instanceof NavigationStart) {
        // Настраиваем хабы для работы уведомлений SignalR.
        await this.configureHubsAsync();
      }
    });
  };

  public get AllFeedObservable() {
    return this.$allFeed;
  };

  private listenAllHubsMainNotifications() {
    this.aHubOnMethods.forEach((method: any) => {
      (<HubConnection>this.hubMainConnection).on(method, (response: any) => {
        this.$allFeed.next(response);
      });
    });
  };

  private listenAllHubsProjectManagementNotifications() {
    this.aHubOnMethods.forEach((method: any) => {
      (<HubConnection>this.hubProjectManagementConnection).on(method, (response: any) => {
        this.$allFeed.next(response);
      });
    });
  };

  private listenHubCommunications() {
    this.aHubCommunicationsOnMethods.forEach((method: any) => {
      (<HubConnection>this.hubCommunicationsConnection).on(method, (response: any) => {
        this.$allFeed.next(response);
      });
    });
  };

  public rerender(): void {
    this.isVisibleMenu = false;
    this._changeDetectorRef.detectChanges();
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

            if (this.currentUrl == "/forbidden") {
              this.isVisibleMenu = false;
            }
          }
        });
  };

  private checkUrlParams() {
    this._router.events
      .subscribe(
        (event: any) => {
          // Отображение левого меню профиля пользователя.
          if (this._aVisibleMenuRoutes.includes(event.url)) {
            this.isVisibleMenu = true;
            localStorage["m_t"] = 1;
          }

          if (event.url.includes("/user/signin")
            || event.url.includes("/user/signup")
            || event.url == "/") {
            this.isVisibleMenu = false;
          }

          if (event.url == "/profile/restore") {
            this.isVisibleMenu = false;
          }

          if (event.url == "/fare-rules") {
            this.isVisibleMenu = false;
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
      this.isVisibleHeader = true;
      this.isVisibleMenu = true;
    }

    // Отображение левого меню профиля пользователя.
    if (this._aVisibleMenuRoutes.includes(currentUrl)) {
      this.isVisibleMenu = true;
      localStorage["m_t"] = 1;
    }

    if (this._aVisibleVacancyMenuRoutes.includes(currentUrl)) {
      localStorage["m_t"] = 1;
      this.isVisibleMenu = true;
    }

    if (this.projectModeUrls.includes(currentUrl)
      || this.resumeModeUrls.includes(currentUrl)) {
      localStorage["m_t"] = 1;
    }

    if (currentUrl.indexOf("projectId") > 0) {
      this.rerender();
      this.isVisibleHeader = true;
      this.isVisibleMenu = true;
    }

    if (currentUrl.indexOf("user/signin") >= 0
      || currentUrl.indexOf("user/signup") >= 0
      || currentUrl === "/") {
      if (currentUrl === "/") {
        this.isVisibleProjectManagementMenu = false;
      }

      this.rerender();
      this.isVisibleHeader = true;
      this.isVisibleMenu = false;
    }

    if (currentUrl.indexOf("press/offer") >= 0) {
      this.isVisibleMenu = false;
    }

    if (currentUrl.indexOf("chat") >= 0) {
      this.isVisibleHeader = true;
      this.isVisibleMenu = true;
    }
  };

  /**
   * Функция настраивает хабы для работы уведомлений SignalR.
   */
  private async configureHubsAsync() {
    if (this.currentUrl !== "user/signin") {
      // Подписываемся на получение всех сообщений.
      this.AllFeedObservable
        .subscribe(async (response: any) => {
          console.log("Подписались на сообщения", response);

          // Если пришел тип уведомления, то просто показываем его.
          if (response.notificationLevel !== undefined && !this._networkService.isNotifyProcessed) {
            this._messageService.add({ severity: response.notificationLevel, summary: response.title, detail: response.message });
            this._networkService.isNotifyProcessed = true;
            this._changeDetectorRef.detectChanges();
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
              } else {
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
        .subscribe(async (_: any) => {
          this.hubMainConnection = new HubConnectionBuilder()
            .configureLogging(LogLevel.Debug)
            .withUrl(API_URL.apiUrl + `/notify?userCode=${localStorage["u_c"]}&module=Main`, HttpTransportType.LongPolling)
            .withAutomaticReconnect()
            .build();

          this.listenAllHubsMainNotifications();

          if (this.hubMainConnection.state !== "Connected" && this.hubMainConnection.connectionId == null) {
            this.hubMainConnection.start().then(async () => {
              console.log("Соединение Main установлено");
              console.log("Main ConnectionId:", this.hubMainConnection.connectionId);
            })
              .catch((err: any) => {
                console.error(err);
              });
          }

          this.hubProjectManagementConnection = new HubConnectionBuilder()
            .configureLogging(LogLevel.Debug)
            .withUrl(API_URL.apiUrlProjectManagment + `/project-management-notify?userCode=${localStorage["u_c"]}&module=ProjectManagement`, HttpTransportType.LongPolling)
            .withAutomaticReconnect()
            .build();

          this.listenAllHubsProjectManagementNotifications();

          if (this.hubMainConnection.state !== "Connected" && this.hubProjectManagementConnection.connectionId == null) {
            this.hubProjectManagementConnection.start().then(async () => {
              console.log("Соединение ProjectManagement установлено");
              console.log("ProjectManagement ConnectionId:", this.hubProjectManagementConnection.connectionId);
            })
              .catch((err: any) => {
                console.error(err);
              });
          }

          this.hubCommunicationsConnection = new HubConnectionBuilder()
            .configureLogging(LogLevel.Debug)
            .withUrl(API_URL.apiUrlCommunications + `/communications?userCode=${localStorage["u_c"]}&module=Communications`, HttpTransportType.LongPolling)
            .withAutomaticReconnect()
            .build();

          this.listenHubCommunications();

          if (this.hubCommunicationsConnection.state !== "Connected" && this.hubCommunicationsConnection.connectionId == null) {
            this.hubCommunicationsConnection.start().then(async () => {
              console.log("Соединение Communications установлено");
              console.log("Communications ConnectionId:", this.hubCommunicationsConnection.connectionId);

              await this.executeCommunicationsHubActions();
            })
              .catch((err: any) => {
                console.error(err);
              });
          }
        });
    }
  };

  /**
   * Функция выполняет действия с модулем коммуникаций.
   */
  private async executeCommunicationsHubActions() {
    if (this.currentUrl.includes("/chat")) {
      // Если успешно подключились, то выполняем действия.
      if (this.hubCommunicationsConnection.state == "Connected") {
        // Вызываем хаб бэка для получения абстрактных областей чата.
        <HubConnection>this.hubCommunicationsConnection.invoke("GetScopesAsync", localStorage["u_e"])
          .catch((err: any) => {
            console.error(err);
          });

        // Получаем ответ из хаба бэка.
        this.hubCommunicationsConnection.on("getAbstractScopes", (response: any) => {
          console.log("Список абстрактных областей чата: ", response);

          // Используем прокси-сервис для передачи данных.
          this._communicationsService.sendAbstractScopes(response);
        });

        // Подписка на получение групп объектов абстрактной области из прокси-сервиса.
        this._communicationsService.communicationsAbstractGroups$.subscribe((selectedAbstractScope: any) => {
          if (selectedAbstractScope !== null) {
            // Вызываем хаб бэка для получения групп объектов абстрактной области чата.
            <HubConnection>this.hubCommunicationsConnection.invoke(
              "GetScopeGroupObjectsAsync",
              selectedAbstractScope.abstractScopeId,
              selectedAbstractScope.abstractScopeType,
              localStorage["u_e"],
              selectedAbstractScope.dialogGroupType)
              .catch((err: any) => {
                console.error(err);
              });

            // Получаем ответ из хаба бэка.
            this.hubCommunicationsConnection.on("getScopeGroupObjects", (groupObjects: any) => {
              console.log("Список групп объектов абстрактной области чата: ", groupObjects);

              // Используем прокси-сервис для передачи данных.
              this._communicationsService.sendGroupObjects(groupObjects);
            });
          }
        });

        this._communicationsService.dialogMessages$.subscribe((selectedDialog: any) => {
          // Вызываем хаб бэка для получения сообщений диалога.
          <HubConnection>this.hubCommunicationsConnection.invoke(
            "GetDialogMessagesAsync",
            selectedDialog.dialogId,
            localStorage["u_e"])
            .catch((err: any) => {
              console.error(err);
            });
        });

        // Получаем ответ из хаба бэка.
        this.hubCommunicationsConnection.on("getDialogMessages", (dialogMessages: any) => {
          console.log("Список сообщений диалога: ", dialogMessages);

          this._communicationsService.receiveDialogMessages(dialogMessages);
        });

        this._communicationsService.sendMessage$.subscribe((sendedMessage: any) => {
          // Вызываем хаб бэка для отправки сообщения диалога.
          <HubConnection>this.hubCommunicationsConnection.invoke(
            "SendMessageToBackAsync",
            sendedMessage.message,
            sendedMessage.dialogId,
            localStorage["u_e"])
            .catch((err: any) => {
              console.error(err);
            });
        });

        // Получаем ответ из хаба бэка.
        this.hubCommunicationsConnection.on("sendMessageToFront", (dialogMessage: any) => {
          console.log("Сообщение диалога: ", dialogMessage);

          this._communicationsService.receiveMessage(dialogMessage);
        });
      }

      else {
        throw new Error("Хаб коммуникаций не был подключен. Действия с ним не будут выполнены. " +
          `HubCommunicationsConnectionState: ${this.hubCommunicationsConnection.state}.`);
      }
    }
  };

  public ngOnDestroy(): void {
    this.routeSubscription.unsubscribe();
  }
}
