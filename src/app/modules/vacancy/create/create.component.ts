import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { MessageService } from "primeng/api";
import { Subscription } from "rxjs";
import { SignalrService } from "../../notifications/signalr/services/signalr.service";
import { CreateProjectVacancyInput } from "../models/input/create-project-vacancy-input";
import { CreateVacancyInput } from "../models/input/create-vacancy-input";
import { VacancyService } from "../services/vacancy.service";

@Component({
    selector: "create",
    templateUrl: "./create.component.html",
    styleUrls: ["./create.component.scss"]
})

/**
 * Класс компонента создания вакансии.
 */
export class CreateVacancyComponent implements OnInit {
    constructor( private readonly _router: Router,
        private readonly _vacancyService: VacancyService,
        private readonly _signalrService: SignalrService,
        private readonly _messageService: MessageService,
        private readonly _activatedRoute: ActivatedRoute) { }
    public readonly vacancy$ = this._vacancyService.vacancy$;

    vacancyName: string = "";
    vacancyText: string = "";
    workExperience: string = "";
    employment: string = "";
    payment: string = "";
    allFeedSubscription: any;
    projectId: number = 0;

    public async ngOnInit() {
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

        this.checkUrlParams();
    };

    /**
     * Функция слушает все хабы.
     */
     private listenAllHubsNotifications() {
        this._signalrService.listenSuccessCreatedUserVacancyInfo();
    };


   /**
     * Функция создает вакансию отдельно либо вакансию проекта и прикрепляет ее спразу к нему.     
     * @returns - Данные вакансии.
     */
    public async onCreateVacancyAsync() {  
        if (!this.projectId) {
            this.createVacancyAsync();
        }                

        else {
            this.createProjectVacancyAsync();
        }
    };

    /**
     * Функция создает вакансию вне проекта.
     * @returns - Данные вакансии.
     */
    private async createVacancyAsync() {
        let model = this.CreateVacancyModel(); 
        (await this._vacancyService.createVacancyAsync(model))
        .subscribe((response: any) => {
            console.log("Новая вакансия: ", this.vacancy$.value);            

            if (response.errors !== null && response.errors.length > 0) {
                response.errors.forEach((item: any) => {
                    this._messageService.add({ severity: 'error', summary: "Что то не так", detail: item.errorMessage });
                });  
            }

            else {
                setTimeout(() => {
                    this._router.navigate(["/vacancies/catalog"]);
                }, 4000);
            }   
        });
    };

    /**
     * Функция создает вакансию вне проекта.
     * @returns - Данные вакансии.
     */
     private async createProjectVacancyAsync() {
        let model = this.CreateProjectVacancyModel(); 
        (await this._vacancyService.createProjectVacancyAsync(model))
        .subscribe((response: any) => {
            console.log("Новая вакансия проекта: ", this.vacancy$.value);            

            if (response.errors !== null && response.errors.length > 0) {
                response.errors.forEach((item: any) => {
                    this._messageService.add({ severity: 'error', summary: "Что то не так", detail: item.errorMessage });
                });  
            }

            else {
                setTimeout(() => {
                    let projectId = this.projectId;
                    this._router.navigate(["/projects/project"], {
                        queryParams: {
                            projectId,
                            mode: "view"
                        }
                    });
                }, 4000);
            }   
        });
    };

    /**
     * Функция создает модель для создания вакансии вне проекта.
     * @returns - Входная модель вакансии.
     */
    private CreateVacancyModel(): CreateVacancyInput {
        let model = new CreateVacancyInput();
        model.VacancyName = this.vacancyName;
        model.VacancyText = this.vacancyText;
        model.Employment = this.employment;
        model.Payment = this.payment;
        model.WorkExperience = this.workExperience;

        return model;
    };

    /**
     * Функция создает модель для создания вакансии проекта.
     * @returns - Входная модель вакансии.
     */
     private CreateProjectVacancyModel(): CreateProjectVacancyInput {
        let model = new CreateProjectVacancyInput();
        model.VacancyName = this.vacancyName;
        model.VacancyText = this.vacancyText;
        model.Employment = this.employment;
        model.Payment = this.payment;
        model.WorkExperience = this.workExperience;
        model.ProjectId = this.projectId;

        return model;
    };

    public ngOnDestroy(): void {
        (<Subscription>this.allFeedSubscription).unsubscribe();
    };

    private checkUrlParams() {
        this._activatedRoute.queryParams
        .subscribe(params => {
            // Если в роуте есть Id проекта, то идет создание вакансии проекта, а не отдельно.
            if (params["projectId"]) {
                this.projectId = params["projectId"];
            }
          });
    };
}