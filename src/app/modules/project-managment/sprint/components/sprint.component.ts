import {Component, OnDestroy, OnInit} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { MessageService } from "primeng/api";
import { Subscription } from "rxjs";
import {ProjectManagmentService} from "../../services/project-managment.service";
import { forkJoin } from "rxjs";
import {SprintInput} from "../models/sprint-input";
import { ProjectManagementSignalrService } from "src/app/modules/notifications/signalr/services/project-magement-signalr.service";

@Component({
  selector: "sprints",
  templateUrl: "./sprint.component.html",
  styleUrls: ["./sprint.component.scss"]
})

/**
 * Класс компонента спринтов.
 */
export class SprintComponent implements OnInit, OnDestroy {
  constructor( private readonly _router: Router,
               private readonly _messageService: MessageService,
               private readonly _activatedRoute: ActivatedRoute,
               private readonly _projectManagmentService: ProjectManagmentService,
               private readonly _projectManagementSignalrService: ProjectManagementSignalrService) { }
  public readonly sprints$ = this._projectManagmentService.sprints;

  subscription?: Subscription;
  projectId: number = 0;
  selectedSprint: any;
  projectSprintId: number = 0;
  isShowAvailableActions: boolean = false;

  public async ngOnInit() {
    if (!this._projectManagementSignalrService.isConnected) {
      // Подключаемся.
      this._projectManagementSignalrService.startConnection().then(() => {
        console.log("Подключились");

        this.listenAllHubsNotifications();
      });
    }

    // Подписываемся на получение всех сообщений.
    this.subscription = this._projectManagementSignalrService.AllFeedObservable
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
      await this.getProjectSprintsAsync()
    ]).subscribe();
  };

  /**
   * Функция слушает все хабы.
   */
  private listenAllHubsNotifications() {
    this._projectManagementSignalrService.listenSuccessStartSprint();
    this._projectManagementSignalrService.listenWarningStartSprint();
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
  private async getProjectSprintsAsync() {
    (await this._projectManagmentService.getSprintsAsync(this.projectId))
      .subscribe(_ => {
        console.log("Список спринтов:", this.sprints$.value);
      });
  };

  /**
   * Функция получает выбранный спринт и переходит на страницу просмотра данных спринта.
   */
  public onSelectSprint(event: any, selectedProjectSprintId: number | null) {
    let projectSprintId

    // Берем из ивента, если выбрали чекбокс.
    if (selectedProjectSprintId == null) {
      projectSprintId = event.data.projectSprintId;
    }

    // Если кликнули по ссылкам, то берем переданный selectedProjectSprintId.
    else {
      projectSprintId = selectedProjectSprintId;
    }

    let projectId = this.projectId;
    console.log("onSelectSprint", event);

    this._router.navigate(["/project-management/sprints/sprint/details"], {
      queryParams: {
        projectId,
        projectSprintId
      }
    });
  };

  /**
   * Функция записывает данные спринта, необходимые для дальнейших действий с ним.
   * @param projectSprintId - Id спринта в рамках проекта.
   */
  public onSelectRowSprint(projectSprintId: number) {
    this.isShowAvailableActions = !this.isShowAvailableActions;

    this.projectSprintId = projectSprintId;
  };

  /**
   * Функция начинает спринт проекта.
   */
  public async onRunSprintAsync() {
    let sprintInput = new SprintInput();
    sprintInput.projectId = +this.projectId;
    sprintInput.projectSprintId = +this.projectSprintId;


    (await this._projectManagmentService.runSprintAsync(sprintInput))
      .subscribe(async _ => {
        await this.getProjectSprintsAsync();
      });
  };

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}
