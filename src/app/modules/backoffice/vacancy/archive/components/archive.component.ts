import { Component, OnInit } from "@angular/core";
import { forkJoin } from "rxjs";
import { MessageService } from "primeng/api";
import { BackOfficeService } from "../../../services/backoffice.service";

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
    public readonly deleteVacancyArchive$ = this._backofficeService.deleteProjectArchive$;

    allFeedSubscription: any;

    constructor(private readonly _backofficeService: BackOfficeService,
        private readonly _messageService: MessageService) {

    }

    public async ngOnInit() {
        forkJoin([
           await this.getVacanciesArchiveAsync()
        ]).subscribe();
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
     * Функция удаляет вакансию из архива.
     */
     public async onDeleteVacancyArchiveAsync(vacancyId: number) {
        (await this._backofficeService.deleteVacancyArchiveAsync(vacancyId))
        .subscribe(async _ => {
            console.log("Удалили вакансию из архива: ", this.deleteVacancyArchive$.value);  

            await this.getVacanciesArchiveAsync();
        });
    };
}
