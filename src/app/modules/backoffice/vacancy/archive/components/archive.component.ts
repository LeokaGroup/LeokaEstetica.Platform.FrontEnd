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
 * Класс компонента вакансий в архиве.
 */
export class VacanciesArchiveComponent implements OnInit {
    public readonly archivedVacancies$ = this._backofficeService.archivedVacancies$;

    allFeedSubscription: any;

    constructor(private readonly _backofficeService: BackOfficeService,
        private readonly _signalrService: SignalrService,
        private readonly _messageService: MessageService,
        private readonly _router: Router,
        private readonly _projectService: ProjectService) {

    }

    public async ngOnInit() {
        forkJoin([
           await this.getVacanciesArchiveAsync()
        ]).subscribe();
    };

    /**
     * Функция слушает все хабы.
     */
    private listenAllHubsNotifications() {
      
    };

    /**
     * Функция получает список вакансий в архиве.
     * @returns Список вакансий.
     */
    private async getVacanciesArchiveAsync() {
        (await this._backofficeService.getVacanciesArchiveAsync())
        .subscribe(_ => {
            console.log("Вакансии в архиве:", this.archivedVacancies$.value);
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
}
