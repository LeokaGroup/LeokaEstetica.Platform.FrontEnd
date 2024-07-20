import {Component, OnDestroy, OnInit} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { MessageService } from "primeng/api";
import { Subscription } from "rxjs";
import { SignalrService } from "../../../notifications/signalr/services/signalr.service";
import {ProjectManagmentService} from "../../services/project-managment.service";
import { forkJoin } from "rxjs";
import {ProjectTaskExecutorInput} from "../../task/models/input/project-task-executor-input";
import {ProjectTaskWatcherInput} from "../../task/models/input/project-task-watcher-input";
import {UntypedFormControl, UntypedFormGroup} from "@angular/forms";
import {UpdateSprintNameInput} from "../../sprint/models/update-sprint-name-input";
import {UpdateSprintDetailsInput} from "../../sprint/models/update-sprint-details-input";
import {UpdateSprintExecutorInput} from "../../sprint/models/update-sprint-executor-input";
import {UpdateSprintWatchersInput} from "../../sprint/models/update-sprint-watchers-input";

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
  sprintTasks: any[] = [];

  formExecutors: UntypedFormGroup = new UntypedFormGroup({
    "executorName": new UntypedFormControl("", [

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
      .subscribe(async _ => {
        console.log("Детали спринта:", this.sprintDetails$.value);

        this.sprintName = this.sprintDetails$.value.sprintName;
        this.sprintDetails = this.sprintDetails$.value.sprintGoal;
        // this.sprintTasks = this.sprintDetails$.value.sprintTasks;
        
        // console.log("Задачи спринта:", this.sprintTasks);

        await this.onGetSelectTaskPeopleAsync(true);
      });
  };

    /**
     * Функция переходит к деталям задачи.
     * @param projectTaskId - Id задачи в рамках проекта.
     */
    public onSelectTask(projectTaskId: number, taskTypeId: number) {
      let projectId = this.projectId;

      localStorage["t_t_i"] = taskTypeId;

      this._router.navigate(["/project-management/space/details"], {
          queryParams: {
              projectId,
              taskId: projectTaskId
          }
      });
  };

  public async onCreateSprintCommentAsync(comment: string) {

  };

  public onActivateSprintName() {
    this.isActiveSprintName = !this.isActiveSprintName;
  };

  public onActivateSprintDetails() {
    this.isActiveSprintDetails = !this.isActiveSprintDetails;
  };

  /**
   * TODO: Эта логика дублируется.
   * Функция получает исполнителей для выбора.
   * @returns - Список статусов.
   */
  public async onGetSelectTaskPeopleAsync(isLoadExecutors: boolean = false) {
    (await this._projectManagmentService.getSelectTaskPeopleAsync(this.projectId))
      .subscribe(_ => {
        console.log("Исполнители и наблюдатели для выбора: ", this.taskPeople$.value);
        this.aPeople = this.taskPeople$.value;

        // Если необходимо заполнить список исполнителей ранее сохраненным исполнителем.
        if (isLoadExecutors) {
          let value = this.taskPeople$.value.find((st: any) => st.userId == this.sprintDetails$.value.executorId);
          this.formExecutors.get("executorName")?.setValue(value);
        }
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
   * Функция отвязывает наблюдателя спринта.
   * @param removedValue - Удаляемое значение.
   * @param i - Индекс.
   */
  public async onDetachSprintWatcherAsync(removedValue: string, i: number) {
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

  /**
   * Функция обновляет название спринта.
   * @param sprintName - Название спринта.
   */
  public async onSaveSprintNameAsync(sprintName: string) {
    let updateSprintInput = new UpdateSprintNameInput();
    updateSprintInput.projectId = +this.projectId;
    updateSprintInput.sprintName = sprintName;
    updateSprintInput.projectSprintId = +this.projectSprintId;

    (await this._projectManagmentService.updateSprintNameAsync(updateSprintInput))
      .subscribe(_ => {
        this.isActiveSprintName = false;
      });
  };

  /**
   * Функция обновляет название спринта.
   * @param sprintDetails - Описание спринта.
   */
  public async onSaveSprintDetailsAsync(sprintDetails: string) {
    let updateSprintDetailsInput = new UpdateSprintDetailsInput();
    updateSprintDetailsInput.projectId = +this.projectId;
    updateSprintDetailsInput.sprintDetails = sprintDetails;
    updateSprintDetailsInput.projectSprintId = +this.projectSprintId;

    (await this._projectManagmentService.updateSprintDetailsAsync(updateSprintDetailsInput))
      .subscribe(_ => {
        this.isActiveSprintDetails = false;
      });
  };

  /**
   * Функция обновляет исполнителя спринта (ответственный за выполнение спринта).
   * @param executorId - Id исполнителя спринта.
   */
  public async onSaveSprintExecutorAsync(executorId: number) {
    let updateSprintExecutorInput = new UpdateSprintExecutorInput();
    updateSprintExecutorInput.projectId = +this.projectId;
    updateSprintExecutorInput.executorId = executorId;
    updateSprintExecutorInput.projectSprintId = +this.projectSprintId;

    (await this._projectManagmentService.updateSprintExecutorAsync(updateSprintExecutorInput))
      .subscribe(_ => {

      });
  };

  /**
   * Функция обновляет наблюдателей спринта.
   * @param watcherIds - Наблюдатели спринта.
   */
  public async onSaveSprintWatchersAsync(watchers: any) {
    let updateSprintWatchersInput = new UpdateSprintWatchersInput();
    updateSprintWatchersInput.projectId = +this.projectId;
    updateSprintWatchersInput.watcherIds = [watchers.userId];
    updateSprintWatchersInput.projectSprintId = +this.projectSprintId;

    (await this._projectManagmentService.updateSprintWatchersAsync(updateSprintWatchersInput))
      .subscribe(_ => {

      });
  };

  

  public onSelectPanelMenu() {
    this._projectManagmentService.isLeftPanel = true;
  };

  public onClosePanelMenu() {
    this._projectManagmentService.isLeftPanel = false;
  };

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}
