import { Component, OnInit } from "@angular/core";
import { forkJoin } from "rxjs";
import { HeaderService } from "src/app/modules/header/services/header.service";
import { ModerationService } from "../../services/moderation.service";

@Component({
    selector: "moderation",
    templateUrl: "./moderation.component.html",
    styleUrls: ["./moderation.component.scss"]
})

/**
 * Класс компонента модерации.
 */
export class ModerationComponent implements OnInit {
    public readonly headerData$ = this._headerService.headerData$;
    public readonly projectsModeration$ = this._moderationService.projectsModeration$;
    public readonly projectModeration$ = this._moderationService.projectModeration$;

    isHideAuthButtons: boolean = false;
    aProjects: any[] = [];
    totalProjects: number = 0;

    constructor(private readonly _headerService: HeaderService,
        private readonly _moderationService: ModerationService) {
    }

    public async ngOnInit() {
        forkJoin([
            await this.getHeaderItemsAsync(),
            await this._headerService.refreshTokenAsync(),
            await this.getProjectsModerationAsync()
         ]).subscribe();
    }

    /**
     * Функция получит список элементов хидера.
     * @returns - Список элементов хидера.
     */
    private async getHeaderItemsAsync() {
        (await this._headerService.getHeaderItemsAsync())
        .subscribe(_ => {
            console.log("Данные хидера: ", this.headerData$.value);
        });
    };

    public async onSelectTabAsync(event: any) {
        console.log(event);
    };
     
    /**
     * Функция получает список проектов для модерации.
     * @returns - Список проектов.
     */
      private async getProjectsModerationAsync() {
        (await this._moderationService.getProjectsModerationAsync())
        .subscribe((response: any) => {
            console.log("Проекты для модерации: ", response);
            this.aProjects = response.projects;
            this.totalProjects = response.total;
        });
    };

    /**
     * Функция получает проект для просмотра модератором.
     * @param projectId - Id проекта.
     * @returns - Данные проекта.
     */
    public async onPreviewProjectAsync(projectId: number) {
        (await this._moderationService.previewProjectAsync(projectId))
        .subscribe(_ => {
            console.log("Проект для модерации: ", this.projectModeration$.value);
        });
    };
}
