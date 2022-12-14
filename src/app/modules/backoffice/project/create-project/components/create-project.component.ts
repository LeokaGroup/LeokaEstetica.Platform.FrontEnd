import { Component, OnDestroy, OnInit } from "@angular/core";
import { forkJoin, Subscription } from "rxjs";
import { SignalrService } from "src/app/modules/notifications/signalr/services/signalr.service";
import { MessageService } from "primeng/api";
import { BackOfficeService } from "../../../services/backoffice.service";
import { CreateProjectInput } from "../models/input/create-project-input";
import { Router } from "@angular/router";
import { ProjectService } from "src/app/modules/project/services/project.service";

@Component({
    selector: "create-project",
    templateUrl: "./create-project.component.html",
    styleUrls: ["./create-project.component.scss"]
})

/**
 * Класс проектов пользователя.
 */
export class CreateProjectComponent implements OnInit, OnDestroy {
    public readonly projectColumns$ = this._backofficeService.projectColumns$;
    public readonly projectData$ = this._backofficeService.projectData$;
    public readonly projectStages$ = this._projectService.projectStages$;

    allFeedSubscription: any;
    projectName: string = "";
    projectDetails: string = "";
    selectedStage: any;

    constructor(private readonly _backofficeService: BackOfficeService,
        private readonly _signalrService: SignalrService,
        private readonly _messageService: MessageService,
        private readonly _router: Router,
        private readonly _projectService: ProjectService) {
    }

    public async ngOnInit() {
        forkJoin([
           await this.getProjectsColumnNamesAsync(),
           await this.getProjectStagesAsync()
        ]).subscribe();

        // Подключаемся.
        this._signalrService.startConnection().then(() => {
            console.log("Подключились");

            this.listenAllHubsNotifications();            

            // Подписываемся на получение всех сообщений.
            this.allFeedSubscription = this._signalrService.AllFeedObservable
                .subscribe((response: any) => {
                    console.log("Подписались на сообщения", response);
                    this._messageService.add({ severity: response.notificationLevel, summary: response.title, detail: response.message });
                });
        });
    };

    /**
     * Функция слушает все хабы.
     */
    private listenAllHubsNotifications() {
        this._signalrService.listenSuccessCreatedUserProjectInfo();
        this._signalrService.listenWarningDublicateUserProjectInfo();
    };

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

    /**
     * Функция создает новый проект пользователя.
     * @returns Данные проекта.
     */
    public async onCreateProjectAsync() {
        let createProjectInput = new CreateProjectInput();
        createProjectInput.ProjectName = this.projectName;
        createProjectInput.ProjectDetails = this.projectDetails;
        createProjectInput.ProjectStage = this.selectedStage.stageSysName;

        (await this._backofficeService.createProjectAsync(createProjectInput))
            .subscribe((response: any) => {
                console.log("Создание проекта: ", this.projectData$.value);

                if (this.projectData$.value.errors !== null && this.projectData$.value.errors.length > 0) {
                    response.errors.forEach((item: any) => {
                        this._messageService.add({ severity: 'error', summary: "Что то не так", detail: item.errorMessage });
                    });  
                }

                else {
                    setTimeout(() => {
                        this._router.navigate(["/profile/projects/my"]);
                    }, 4000);
                }                           
            });
    };

    public ngOnDestroy(): void {
        (<Subscription>this.allFeedSubscription).unsubscribe();
    };

    /**
     * Функция получает список стадий проекта.
     * @returns - Список стадий проекта.
     */
    private async getProjectStagesAsync() {
        (await this._projectService.getProjectStagesAsync())
            .subscribe(_ => {
                console.log("Стадии проекта для выбора: ", this.projectStages$.value);
            });
    };

    public onSelectProjectStage() {
        console.log(this.selectedStage);
    };
}