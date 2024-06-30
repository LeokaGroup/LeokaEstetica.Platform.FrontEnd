import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { forkJoin, Subscription } from "rxjs";
import { ProjectManagmentService } from "../../services/project-managment.service";
import {ProjectManagementSignalrService} from "../../../notifications/signalr/services/project-magement-signalr.service";
import {MessageService} from "primeng/api";

@Component({
  selector: "",
  templateUrl: "./workspace.component.html",
  styleUrls: ["./workspace.component.scss"]
})

/**
 * Класс компонента пространств проектов.
 */
export class WorkSpaceComponent implements OnInit {
  constructor(private readonly _projectManagmentService: ProjectManagmentService,
              private readonly _router: Router,
              private readonly _activatedRoute: ActivatedRoute,
              private readonly _projectManagementSignalrService: ProjectManagementSignalrService,
              private readonly _messageService: MessageService) {
  }

  public readonly workspaces$ = this._projectManagmentService.workspaces$;
  public readonly projectWorkspaceSettings$ = this._projectManagmentService.projectWorkspaceSettings$;

  aWorkspaces: any[] = [];
  isPaginator: boolean = false;
  allFeedSubscription: any;
  subscription?: Subscription;

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
      await this.getWorkSpacesAsync()
    ]).subscribe();
  };

  /**
   * Функция слушает все хабы.
   */
  private listenAllHubsNotifications() {
    this._projectManagementSignalrService.listenSendNotifyWarningChangeEpicStatus();
    this._projectManagementSignalrService.listenSendNotifyWarningChangeStoryStatus();
  };

  /**
   * Функция получает все раб.пространства, в которых есть текущий пользователь.
   */
  private async getWorkSpacesAsync() {
    (await this._projectManagmentService.getWorkSpacesAsync())
      .subscribe(_ => {
        console.log("Список раб.пространств проектов: ", this.workspaces$.value);
        this.aWorkspaces = this.workspaces$.value;
        this.isPaginator = this.workspaces$.value.length > 0;
      });
  };

  /**
   * Функция переходит в раб.пространство проекта из общего пространства.
   * Проверка фиксации настроек проекта уже произведена ранее в компоненте хидера.
   */
  public async onRouteWorkSpaceAsync(projectId: number) {
    await this.getBuildProjectSpaceSettingsAsync(projectId);
  };

  // TODO: Дублируется.
  private async getBuildProjectSpaceSettingsAsync(projectId: number) {
    (await this._projectManagmentService.getBuildProjectSpaceSettingsAsync(projectId))
      .subscribe(_ => {
        console.log("projectWorkspaceSettings", this.projectWorkspaceSettings$.value);

        // Если настройки были зафиксированы, то переходим сразу в раб.пространство проекта.
        if (this.projectWorkspaceSettings$.value.isCommitProjectSettings) {
          // Чтобы страница прогрузилась - сделано через window.location.href.
          window.location.href = this.projectWorkspaceSettings$.value.projectManagmentSpaceUrl;
        }

        else {
          this._router.navigate(["/project-management/start"], {
            queryParams: {
              projectId
            }
          });
        }
      });
  };
}
