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
    public readonly projectColumns$ = this._backofficeService.projectColumns$;

    allFeedSubscription: any;

    constructor(private readonly _backofficeService: BackOfficeService,
        private readonly _signalrService: SignalrService,
        private readonly _messageService: MessageService,
        private readonly _router: Router,
        private readonly _projectService: ProjectService) {

    }

    public async ngOnInit() {
        forkJoin([
           await this.getProjectsArchiveAsync(),
           await this.getProjectsColumnNamesAsync()
        ]).subscribe();
    };

    /**
     * Функция слушает все хабы.
     */
    private listenAllHubsNotifications() {
      
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
     * Функция удаляет проект.
     */
    //  public async onDeleteProjectAsync() {
    //     (await this._projectService.deleteProjectsAsync(this.projectId))
    //     .subscribe(async (response: any) => {
    //         console.log("Удалили проект: ", response);
    //         this.isDeleteProject = false;
    //         await this.getUserProjectsAsync();
    //     });
    // };

    /**
    // * Функция получает поля таблицы проектов пользователя.
    // * @returns - Список полей.
    */
    private async getProjectsColumnNamesAsync() {
        (await this._backofficeService.getProjectsColumnNamesAsync())
            .subscribe(_ => {
                console.log("Столбцы таблицы проектов пользователя: ", this.projectColumns$.value);
            });
    };
}
