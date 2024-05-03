import {Component, OnDestroy, OnInit} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { MessageService } from "primeng/api";
import { Subscription } from "rxjs";
import { SignalrService } from "../../../notifications/signalr/services/signalr.service";
import {ProjectManagmentService} from "../../services/project-managment.service";
import { forkJoin } from "rxjs";

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

  subscription?: Subscription;
  projectId: number = 0;
  selectedSprint: any;
  projectSprintId: number = 0;

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
      });
  };

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}
