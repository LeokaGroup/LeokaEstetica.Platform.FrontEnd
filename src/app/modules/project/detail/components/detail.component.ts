import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
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
        private readonly _messageService: MessageService) {
    }

    public readonly catalog$ = this._projectService.catalog$;
    public readonly selectedProject$ = this._projectService.selectedProject$;

    projectName: string = "";
    projectDetails: string = "";
    projectId: number = 0;
    allFeedSubscription: any;

    public async ngOnInit() {
        forkJoin([
        this.checkUrlParams()
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
                
            }

            if (mode == "edit") {
                this.getEditProjectAsync(params["projectId"], "Edit");
                this.projectId = params["projectId"];
            }
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
}