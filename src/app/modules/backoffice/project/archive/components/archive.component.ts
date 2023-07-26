import { Component, OnInit } from "@angular/core";
import { forkJoin } from "rxjs";
import { SignalrService } from "src/app/modules/notifications/signalr/services/signalr.service";
import { MessageService } from "primeng/api";
import { BackOfficeService } from "../../../services/backoffice.service";
import { Router } from "@angular/router";
import { ProjectService } from "src/app/modules/project/services/project.service";

@Component({
    selector: "archive",
    templateUrl: "./archive.component.html",
    styleUrls: ["./archive.component.scss"]
})

/**
 * Класс компонента проектов в архиве.
 */
export class ProjectsArchiveComponent implements OnInit {
    public readonly archivedProjects$ = this._backofficeService.archivedProjects$;
    public readonly deleteProjectArchive$ = this._backofficeService.deleteProjectArchive$;

    allFeedSubscription: any;

    constructor(private readonly _backofficeService: BackOfficeService,
        private readonly _signalrService: SignalrService,
        private readonly _messageService: MessageService,
        private readonly _router: Router,
        private readonly _projectService: ProjectService) {

    }

    public async ngOnInit() {
        forkJoin([
           await this.getProjectsArchiveAsync()
        ]).subscribe();

        // Подключаемся.
        this._signalrService.startConnection().then(() => {
            console.log("Подключились");

            this.listenAllHubsNotifications();

            // Подписываемся на получение всех сообщений.
          this.allFeedSubscription = this._signalrService.AllFeedObservable
            .subscribe((response: any) => {
              console.log("Подписались на сообщения", response);
              this._messageService.add({
                severity: response.notificationLevel,
                summary: response.title,
                detail: response.message
              });
            });
        });
    };

    /**
     * Функция слушает все хабы.
     */
    private listenAllHubsNotifications() {
        this._signalrService.listenSuccessDeleteProjectArchive();
    };

    /**
     * Функция получает список проектов в архиве.
     * @returns Список проектов.
     */
    private async getProjectsArchiveAsync() {
        (await this._backofficeService.getProjectsArchiveAsync())
        .subscribe(_ => {
            console.log("Проекты в архиве:", this.archivedProjects$.value);
        });
    };

    /**
     * Функция удаляет проект из архива.
     */
     public async onDeleteProjectArchiveAsync(projectId: number) {
        (await this._backofficeService.deleteProjectArchiveAsync(projectId))
        .subscribe(async _ => {
            console.log("Удалили проект из архива: ", this.deleteProjectArchive$.value);  
            await this.getProjectsArchiveAsync();
        });
    };
}
