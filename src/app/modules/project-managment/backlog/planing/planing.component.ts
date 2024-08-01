import {Component, OnInit} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { forkJoin } from "rxjs";
import { RedirectService } from "src/app/common/services/redirect.service";
import { ProjectManagmentService } from "../../services/project-managment.service";
import {MessageService, PrimeNGConfig} from "primeng/api";
import {TranslateService} from "@ngx-translate/core";
import {PlaningSprintInput} from "../../task/models/input/planing-sprint-input";
import { ProjectManagementSignalrService } from "src/app/modules/notifications/signalr/services/project-magement-signalr.service";
import { SearchAgileObjectTypeEnum } from "src/app/modules/enums/search-agile-object-type-enum";

@Component({
  selector: "",
  templateUrl: "./planing.component.html",
  styleUrls: ["./planing.component.scss"]
})

/**
 * Класс компонента спринтов (планирование спринта).
 */
export class PlaningSprintComponent implements OnInit {
  constructor(private readonly _projectManagmentService: ProjectManagmentService,
              private readonly _router: Router,
              private readonly _redirectService: RedirectService,
              private readonly _activatedRoute: ActivatedRoute,
              private _config: PrimeNGConfig,
              private _translateService: TranslateService,
              private readonly _projectManagementSignalrService: ProjectManagementSignalrService,
              private readonly _messageService: MessageService) {
  }

  public readonly sprintTasks = this._projectManagmentService.sprintTasks$;
  public readonly searchSprintTasks$ = this._projectManagmentService.searchSprintTasks$;
  public readonly taskPeople$ = this._projectManagmentService.taskExecutors$;

  selectedProjectId: number = 0;
  isLoading: boolean = false;
  sprintName: string = "";
  sprintDescription: string = "";
  isSprintDates: boolean = false;
  locale: any;
  dateStart?: Date;
  dateEnd?: Date;
  isSprintTasks: boolean = false;
  allFeedSubscription: any;
  selectedTask: any;
  aSearchTasks: any[] = [];
  isSearchByTaskId: boolean = false;
  isSearchByTaskName: boolean = false;
  isSearchByTaskDescription: boolean = false;
  aAddedTaskSprint: any[] = [];
  selectedExecutor: any;
  aPeople: any[] = [];
  selectedWatcher: any;
  aSelectedWachers: Set<any> = new Set<any>();

  public async ngOnInit() {
    this._projectManagmentService.isLeftPanel = false;

    forkJoin([
      this.checkUrlParams()
    ]).subscribe();

    // Подключаемся.
    this._projectManagementSignalrService.startConnection().then(() => {
      console.log("Подключились");

      this.listenAllHubsNotifications();
    });

    // Подписываемся на получение всех сообщений.
    this._projectManagementSignalrService.AllFeedObservable
      .subscribe((response: any) => {
        console.log("Подписались на сообщения", response);

        // Если пришел тип уведомления, то просто показываем его.
        if (response.notificationLevel !== undefined) {
          this._messageService.add({
            severity: response.notificationLevel,
            summary: response.title,
            detail: response.message
          });
        }
      });

    this._translateService.setDefaultLang('ru');
    this.translate('ru');
    this.locale = this._translateService.getDefaultLang();
  };

  /**
   * Функция слушает все хабы.
   */
  private listenAllHubsNotifications() {
    this._projectManagementSignalrService.listenSuccessPlaningSprint();
  };

  translate(lang: string) {
    this._translateService.use(lang);
    this._translateService.get('primeng').subscribe(res => this._config.setTranslation(res));
  }

  private async checkUrlParams() {
    this._activatedRoute.queryParams
      .subscribe(async params => {
        this.selectedProjectId = params["projectId"];
      });
  };

  public onSelectPanelMenu() {
    this._projectManagmentService.isLeftPanel = true;
  };

  public onSelectTaskLink(fullTaskId: string) {
    let projectId = this.selectedProjectId;

    this._router.navigate(["/project-management/space/details"], {
      queryParams: {
        projectId,
        taskId: fullTaskId
      }
    });
  };

  /**
   * Функция планирует спринт.
   * Добавляет задачи в спринт, если их указали при планировании спринта.
   * calendar по дефолту передает дату и время в UTC.
   */
  public async onPlaningSprintAsync() {
    let planingSprintInput = new PlaningSprintInput();
    let projectId = this.selectedProjectId;
    planingSprintInput.projectId = projectId
    planingSprintInput.sprintName = this.sprintName;
    planingSprintInput.sprintDescription = this.sprintDescription;

    // Заполняем даты, если трогали календарь. Даты пойдут на бэк в UTC.
    if (this.dateStart !== null
      && this.dateStart !== undefined
      && this.dateEnd !== null
      && this.dateEnd !== undefined) {
      planingSprintInput.dateStart = this.dateStart;
      planingSprintInput.dateEnd = this.dateEnd;
    }

    // Если были добавлены задачи.
    if (this.aAddedTaskSprint.length > 0) {
      planingSprintInput.projectTaskIds = this.aAddedTaskSprint.map(x => x.projectTaskId);
    }

    let aWatchers = Array.from(this.aSelectedWachers).map(x => {
      return x.userId;
    });

    planingSprintInput.watcherIds = aWatchers;
    planingSprintInput.executorId = this.selectedExecutor?.userId ?? null;

    (await this._projectManagmentService.planingSprintAsync(planingSprintInput))
      .subscribe(async (_: any) => {
        setTimeout(() => {
          this._router.navigate(["/project-management/sprints"], {
            queryParams: {
              projectId
            }
          });
        }, 4000);
      });
  };

  /**
   * Функция находит задачи для добавления их в спринт.
   * @param event - Ивент события.
   */
  public async onSearchIncludeSprintTaskAsync(event: any) {
    (await this._projectManagmentService.searchAgileObjectAsync(
      event.query, this.isSearchByTaskId, this.isSearchByTaskName, this.isSearchByTaskDescription,
      this.selectedProjectId, SearchAgileObjectTypeEnum.Sprint))
      .subscribe(_ => {
        console.log("Задачи для добавления в спринт", this.searchSprintTasks$.value);
      });
  };

  public onSelectTask() {
    let isTaskInSprint = this.aAddedTaskSprint.find(task => this.selectedTask.projectTaskId === task.projectTaskId) ? true : false;

    if (!isTaskInSprint) {
    this.aAddedTaskSprint.push(this.selectedTask);
    } else {
      console.log('Задача уже добавлена')
    }
  };

  /**
   * Функция удаляет задачу из таблицы на фронте.
   * @param projectTaskId - Id задачи в рамках проекта.
   */
  public onRemoveAddedTask(projectTaskId: number) {
    if (projectTaskId == 0) {
      return;
    }

    let deletedItemIdx = this.aAddedTaskSprint.findIndex(x => x.projectTaskId == projectTaskId);
    this.aAddedTaskSprint.splice(deletedItemIdx, 1);
  };

  /**
   * TODO: Эта логика дублируется.
   * Функция получает исполнителей для выбора.
   * @returns - Список статусов.
   */
  public async onGetSelectTaskPeopleAsync() {
    (await this._projectManagmentService.getSelectTaskPeopleAsync(this.selectedProjectId))
      .subscribe(_ => {
        console.log("Исполнители и наблюдатели для выбора: ", this.taskPeople$.value);
        this.aPeople = this.taskPeople$.value;
      });
  };

  // TODO: Эта логика дублируется.
  public async onSetMeExecutor() {
    // Если еще не подгружали, то подгрузим, затем сделаем текущего пользователя исполнителем.
    if (this.aPeople.length == 0) {
      new Promise(function (resolve, reject) {
        setTimeout(() => resolve(1), 500); // TODO: Должны ставить задержку, иначе не успевает подгрузиться.
      }).then(async () => {
        await this.onGetSelectTaskPeopleAsync()

        return new Promise((resolve, reject) => {
          setTimeout(() => {
            let findUser = this.aPeople.find(x => x.userCode == localStorage["u_c"]);

            if (findUser !== undefined && findUser !== null) {
              this.selectedExecutor = findUser;
            }
          }, 500); // TODO: Должны ставить задержку, иначе не успевает подгрузиться.
        });

      });
    }

    else {
      let findUser = this.aPeople.find(x => x.userCode == localStorage["u_c"]);

      if (findUser !== undefined && findUser !== null) {
        this.selectedExecutor = findUser;
      }
    }
  };

  // TODO: Эта логика дублируется.
  public onSelectWachers() {
    console.log("selectedWatcher", this.selectedWatcher);

    let checkDublicate = Array.from(this.aSelectedWachers).find(x => x.userId == this.selectedWatcher.userId);
    if (checkDublicate == undefined || checkDublicate == null) {
      this.aSelectedWachers.add(this.selectedWatcher);
    }
  };

  // TODO: Эта логика дублируется.
  public async onSetMeWatcher() {
    // Если еще не подгружали, то подгрузим, затем сделаем текущего пользователя наблюдателем.
    if (this.aPeople.length == 0) {
      new Promise(function (resolve, reject) {
        setTimeout(() => resolve(1), 500); // TODO: Должны ставить задержку, иначе не успевает подгрузиться.
      }).then(async () => {
        await this.onGetSelectTaskPeopleAsync()

        return new Promise((resolve, reject) => {
          setTimeout(() => {
            let findUser = this.aPeople.find(x => x.userCode == localStorage["u_c"]);

            if (findUser !== undefined && findUser !== null) {
              this.aSelectedWachers.add(findUser);
            }
          }, 500); // TODO: Должны ставить задержку, иначе не успевает подгрузиться.
        });

      });
    }

    else {
      let findUser = this.aPeople.find(x => x.userCode == localStorage["u_c"]);

      if (findUser !== undefined && findUser !== null) {
        this.aSelectedWachers.add(findUser);
      }
    }
  };
}
