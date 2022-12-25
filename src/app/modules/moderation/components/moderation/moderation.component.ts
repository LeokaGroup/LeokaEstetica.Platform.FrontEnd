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
    aVacancies: any[] = [];
    totalVacancies: number = 0;
    vacancyName: string = "";
    vacancyText: string = "";
    workExperience: string = "";
    employment: string = "";
    payment: string = "";
    isShowPreviewModerationVacancyModal: boolean = false;
    vacancyId: number = 0;

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

        // В зависимости от индекса срабатывает логика нужного таба.
        switch (event.index) {
            case 0:
                await this.getProjectsModerationAsync();
                break;

            case 1:
                await this.getVacanciesModerationAsync();
                break;
        }
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

    /**
     * Функция получает список вакансий для модерации.
     * @returns - Список вакансий.
     */
     private async getVacanciesModerationAsync() {
        (await this._moderationService.getVacanciesModerationAsync())
        .subscribe((response: any) => {
            console.log("Вакансии для модерации: ", response);
            this.aVacancies = response.vacancies;
            this.totalVacancies = response.total;
        });
    };

    /**
     * Функция получает вакансию для просмотра модератором.
     * @param vacancyId - Id вакансии.
     * @returns - Данные вакансии.
     */
     public async onPreviewVacancyAsync(vacancyId: number) {
        this.vacancyId = vacancyId;

        (await this._moderationService.previewVacancyAsync(vacancyId))
        .subscribe((response: any) => {
            console.log("Вакансия для модерации: ", response);
            this.isShowPreviewModerationVacancyModal = true;
            this.vacancyName = response.vacancyName;
            this.vacancyText = response.vacancyText;
            this.employment = response.employment;
            this.payment = response.payment;
            this.workExperience = response.workExperience;
        });
    };
}
