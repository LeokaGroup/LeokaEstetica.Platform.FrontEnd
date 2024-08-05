import { Component, OnInit } from "@angular/core";
import { forkJoin } from "rxjs";
import { SignalrService } from "src/app/modules/notifications/signalr/services/signalr.service";
import { MessageService } from "primeng/api";
import { BackOfficeService } from "../../../services/backoffice.service";

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
        private readonly _messageService: MessageService) {

    }

    public async ngOnInit() {
        forkJoin([
           await this.getProjectsArchiveAsync()
        ]).subscribe();
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

            this._messageService.add({
                severity: this._signalrService.AllFeedObservable.value.notificationLevel,
                summary: this._signalrService.AllFeedObservable.value.title,
                detail: this._signalrService.AllFeedObservable.value.message
            });

            await this.getProjectsArchiveAsync();
        });
    };
}
