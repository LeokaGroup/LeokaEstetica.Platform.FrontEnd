import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { MessageService } from "primeng/api";
import { forkJoin } from "rxjs";
import { SignalrService } from "src/app/modules/notifications/signalr/services/signalr.service";
import { ProjectService } from "../../services/project.service";
import { UpdateProjectInput } from "../models/input/update-project-input";

@Component({
    selector: "detail",
    templateUrl: "./detail.component.html",
    styleUrls: ["./detail.component.scss"]
})

/**
 * Класс деталей проекта (используется для изменения и просмотра проекта).
 */
export class DetailProjectComponent implements OnInit {
    constructor(private readonly _projectService: ProjectService,
        private readonly _activatedRoute: ActivatedRoute,
        private readonly _signalrService: SignalrService,
        private readonly _messageService: MessageService,
        private readonly _router: Router) {
    }

    public readonly catalog$ = this._projectService.catalog$;
    public readonly selectedProject$ = this._projectService.selectedProject$;
    public readonly projectStages$ = this._projectService.projectStages$;
    public readonly projectVacancies$ = this._projectService.projectVacancies$;
    public readonly projectVacanciesColumns$ = this._projectService.projectVacanciesColumns$;

    projectName: string = "";
    projectDetails: string = "";
    projectId: number = 0;
    allFeedSubscription: any;
    isEditMode: boolean = false;
    selectedStage: any;
    isEdit: any;    
    selectedProjectVacancy: any;
    totalVacancies: number = 0;

    public async ngOnInit() {
        forkJoin([
        this.checkUrlParams(),
        await this.getProjectStagesAsync(),
        await this.getProjectVacanciesAsync(),
        await this.getProjectVacanciesColumnNamesAsync()
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
        this._signalrService.listenSuccessUpdatedUserVacancyInfo();
    };

    private checkUrlParams() {
        this._activatedRoute.queryParams
        .subscribe(params => {
            let mode = params["mode"];

            if (mode == "view") {
                this.getEditProjectAsync(params["projectId"], "View");  
                this.isEditMode = false;
            }

            if (mode == "edit") {
                this.getEditProjectAsync(params["projectId"], "Edit");             
                this.isEditMode = true;   
            }

            this.projectId = params["projectId"];
          });
    };

     /**
     * Функция загружает список вакансий для каталога.
     * @param projectId - Id проекта.
     * @param mode - Режим. Чтение или изменение.
     * @returns - Список вакансий.
     */
      private async getEditProjectAsync(projectId: number, mode: string) {    
        (await this._projectService.getProjectAsync(projectId, mode))
        .subscribe(_ => {
            console.log("Получили проект: ", this.selectedProject$.value);
        });
    };
    
    /**
     * Функция обновляет проект.
     * @returns - Обновленные данные проекта.
     */
    public async onUpdateProjectAsync() {
        let model = new UpdateProjectInput();
        model.ProjectName = this.selectedProject$.value.projectName;
        model.ProjectDetails = this.selectedProject$.value.projectDetails;
        model.ProjectId = this.projectId;

        (await this._projectService.updateProjectAsync(model))
        .subscribe(_ => {
            console.log("Обновили проект: ", this.selectedProject$.value);
        });
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

    /**
     * Функция получает список вакансий проекта.
     * @returns - Список вакансий проекта.
     */
    private async getProjectVacanciesAsync() {
        (await this._projectService.getProjectVacanciesAsync(this.projectId))
            .subscribe(_ => {
                console.log("Вакансии проекта: ", this.projectVacancies$.value);
                this.totalVacancies = this.projectVacancies$.value.total;
            });
    };

     /**
    // * Функция получает поля таблицы проектов пользователя.
    // * @returns - Список полей.
    */
    private async getProjectVacanciesColumnNamesAsync() {
        (await this._projectService.getProjectVacanciesColumnNamesAsync())
            .subscribe(_ => {
                console.log("Столбцы таблицы вакансий проектов пользователя: ", this.projectVacanciesColumns$.value);                
            });
    };

    /**
     * Функция переходит на страницу создания вакансии проекта. Передавая Id проекта, к которому будет привязана вакансия автоматически.
     */
    public onRouteCreateProjectVacancy() {
        let projectId = this.projectId;
        
        this._router.navigate(["/vacancies/create"], {
            queryParams: {
                projectId
            }
        });
    };
}