import {Component, OnDestroy, OnInit} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { MessageService } from "primeng/api";
import { Subscription } from "rxjs";
import { SignalrService } from "../../../notifications/signalr/services/signalr.service";
import {ProjectManagmentService} from "../../services/project-managment.service";
import { forkJoin } from "rxjs";

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
               private readonly _signalrService: SignalrService,
               private readonly _messageService: MessageService,
               private readonly _activatedRoute: ActivatedRoute,
               private readonly _projectManagmentService: ProjectManagmentService) { }
  public readonly sprints$ = this._projectManagmentService.sprints;

  subscription?: Subscription;
  projectId: number = 0;
  selectedSprint: any;
  projectSprintId: number = 0;
  isShowAvailableActions: boolean = false;

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
      await this.getProjectSprintsAsync()
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

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}
