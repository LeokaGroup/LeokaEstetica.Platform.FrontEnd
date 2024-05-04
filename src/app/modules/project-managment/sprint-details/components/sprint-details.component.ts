import {Component, OnDestroy, OnInit} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { MessageService } from "primeng/api";
import { Subscription } from "rxjs";
import { SignalrService } from "../../../notifications/signalr/services/signalr.service";
import {ProjectManagmentService} from "../../services/project-managment.service";
import { forkJoin } from "rxjs";
import {ProjectTaskExecutorInput} from "../../task/models/input/project-task-executor-input";
import {ProjectTaskWatcherInput} from "../../task/models/input/project-task-watcher-input";
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: "sprint-details",
  templateUrl: "./sprint-details.component.html",
  styleUrls: ["./sprint-details.component.scss"]
})

/**
 * Класс компонента просмотра данных спринта проекта.
 */
export class SprintDetailsComponent implements OnInit, OnDestroy {
  constructor( private readonly _router: Router,
               private readonly _signalrService: SignalrService,
               private readonly _messageService: MessageService,
               private readonly _activatedRoute: ActivatedRoute,
               private readonly _projectManagmentService: ProjectManagmentService) { }
  public readonly sprintDetails$ = this._projectManagmentService.sprintDetails$;
  public readonly taskPeople$ = this._projectManagmentService.taskExecutors$;

  subscription?: Subscription;
  projectId: number = 0;
  selectedSprint: any;
  projectSprintId: number = 0;
  comment: string = "";
  sprintName: string = "";
  isActiveSprintName: boolean = false;
  isActiveSprintDetails: boolean = false;
  sprintDetails: string = "";
  aPeople: any[] = [];
  selectedExecutor: any;
  selectedWatcher: any;

  formExecutors: FormGroup = new FormGroup({
    "executorName": new FormControl("", [
      Validators.required
    ])
  });

  public async ngOnInit() {
    if (!this._signalrService.isConnected) {
      // Подключаемся.
      this._signalrService.startConnection().then(() => {
        console.log("Подключились");

        this.listenAllHubsNotifications();
      });
    }

    // Подписываемся на получение всех сообщений.
    this.subscription = this._signalrService.AllFeedObservable
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

    forkJoin([
      this.checkUrlParams(),
      await this.getSprintDetailsAsync()
    ]).subscribe();
  };

  /**
   * Функция слушает все хабы.
   */
  private listenAllHubsNotifications() {

  };

  private checkUrlParams() {
    this._activatedRoute.queryParams
      .subscribe(params => {
        if (params["projectId"]) {
          this.projectId = params["projectId"];
          this.projectSprintId = params["projectSprintId"];
        }
      });
  };

  /**
   * Функция получает список спринтов.
   * @returns Список спринтов.
   */
  private async getSprintDetailsAsync() {
    (await this._projectManagmentService.getSprintDetailsAsync(this.projectId, this.projectSprintId))
      .subscribe(_ => {
        console.log("Детали спринта:", this.sprintDetails$.value);

        this.sprintName = this.sprintDetails$.value.sprintName;
      });
  };

  public async onCreateSprintCommentAsync(comment: string) {

  };

  public onActivateSprintName() {

  };

  public onActivateSprintDetails() {

  };

  /**
   * TODO: Эта логика дублируется.
   * Функция получает исполнителей для выбора.
   * @returns - Список статусов.
   */
  public async onGetSelectTaskPeopleAsync() {
    (await this._projectManagmentService.getSelectTaskPeopleAsync(this.projectId))
      .subscribe(_ => {
        console.log("Исполнители и наблюдатели для выбора: ", this.taskPeople$.value);
        this.aPeople = this.taskPeople$.value;
      });
  };

  /**
   * TODO: Эта логика дублируется.
   * Функция обновляет исполнителя задачи.
   */
  public async onChangeTaskExecutorAsync() {
    let projectTaskExecutorInput = new ProjectTaskExecutorInput();
    projectTaskExecutorInput.projectId = +this.projectId;

    // TODO: Тут будет сохраняться в таблицу спринта, не в задачи и название не projectTaskId, аналогично и для исполнителя.
    projectTaskExecutorInput.projectTaskId = this.projectSprintId;
    projectTaskExecutorInput.executorId = this.selectedExecutor.userId;

    (await this._projectManagmentService.changeTaskExecutorAsync(projectTaskExecutorInput))
      .subscribe(async _ => {
        await this.getSprintDetailsAsync();
      });
  };

  /**
   * TODO: Эта логика дублируется.
   * Функция отвязывает наблюдателя задачи.
   * @param removedValue - Удаляемое значение.
   * @param i - Индекс.
   */
  public async onDetachTaskWatcherAsync(removedValue: string, i: number) {
    let projectTaskTagInput = new ProjectTaskWatcherInput();
    projectTaskTagInput.projectId = +this.projectId;

    // TODO: Тут будет сохраняться в таблицу спринта, не в задачи и название не projectTaskId. Аналогично и для наблюдателей.
    projectTaskTagInput.projectTaskId = this.projectSprintId;
    projectTaskTagInput.watcherId = this.taskPeople$.value[i].userId;

    (await this._projectManagmentService.detachTaskWatcherAsync(projectTaskTagInput))
      .subscribe(async _ => {
        await this.getSprintDetailsAsync();
      });
  };

  /**
   * TODO: Эта логика дублируется.
   * Функция привязывает наблюдателя задачи.
   */
  public async onAttachTaskWatcherAsync() {
    let projectTaskExecutorInput = new ProjectTaskWatcherInput();
    projectTaskExecutorInput.projectId = +this.projectId;

    // TODO: Тут будет сохраняться в таблицу спринта, не в задачи и название не projectTaskId. Аналогично и для наблюдателей.
    projectTaskExecutorInput.projectTaskId = this.projectSprintId;
    projectTaskExecutorInput.watcherId = this.selectedWatcher.userId;

    (await this._projectManagmentService.attachTaskWatcherAsync(projectTaskExecutorInput))
      .subscribe(async _ => {
        await this.getSprintDetailsAsync();
      });
  };

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}
