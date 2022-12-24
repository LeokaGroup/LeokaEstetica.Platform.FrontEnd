import { Component, OnInit } from "@angular/core";
import { forkJoin } from "rxjs";
import { HeaderService } from "src/app/modules/header/services/header.service";
import { ApproveProjectInput } from "../../models/input/approve-project-input";
import { RejectProjectInput } from "../../models/input/reject-project-input";
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
    projectName: string = "";
    projectId: number = 0;
    isShowPreviewModerationProjectModal: boolean = false;
    projectDetails: string = "";

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
        this.projectId = projectId;

        (await this._moderationService.previewProjectAsync(projectId))
        .subscribe((response: any) => {
            console.log("Проект для модерации: ", response);
            this.isShowPreviewModerationProjectModal = true;
            this.projectName = response.projectName;
            this.projectDetails = response.projectDetails;
        });
    };

    /**
     * Функция одобряет проект.
     * @param projectId - Id проекта.
     * @returns - Данные проекта.
     */
    public async onApproveProjectAsync(projectId: number) {
        let approveProjectInput = new ApproveProjectInput();
        approveProjectInput.ProjectId = projectId;

        (await this._moderationService.approveProjectAsync(approveProjectInput))
        .subscribe(async (response: any) => {
            console.log("Апрув проекта: ", response);
            this.isShowPreviewModerationProjectModal = false;

            // Подтянем проекты для обновления таблицы.
            await this.getProjectsModerationAsync();
        });
    };

     /**
     * Функция отклоняет проект.
     * @param projectId - Id проекта.
     * @returns - Данные проекта.
     */
    public async onRejectProjectAsync(projectId: number) {
        let rejectProjectInput = new RejectProjectInput();
        rejectProjectInput.ProjectId = projectId;

        (await this._moderationService.rejectProjectAsync(rejectProjectInput))
        .subscribe(async (response: any) => {
            console.log("Отклонение проекта: ", response);
            this.isShowPreviewModerationProjectModal = false;

            // Подтянем проекты для обновления таблицы.
            await this.getProjectsModerationAsync();
        });
    };
}
