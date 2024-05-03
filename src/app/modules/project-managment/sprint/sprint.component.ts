import {Component, OnDestroy, OnInit} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { MessageService } from "primeng/api";
import { Subscription } from "rxjs";
import { SignalrService } from "../../notifications/signalr/services/signalr.service";
import {ProjectManagmentService} from "../services/project-managment.service";

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

    this.checkUrlParams();
    await this.getUserProjectsAsync();
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
        }
      });
  };

  /**
   * Функция получает список спринтов.
   * @returns Список спринтов.
   */
  private async getUserProjectsAsync() {
    (await this._projectManagmentService.getSprintsAsync(this.projectId))
      .subscribe(_ => {
        console.log("Список спринтов:", this.sprints$.value);
      });
  };

  public onSelectSprint() {

  };

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}
