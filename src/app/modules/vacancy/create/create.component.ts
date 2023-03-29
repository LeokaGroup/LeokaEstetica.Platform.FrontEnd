import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { MessageService } from "primeng/api";
import { Subscription } from "rxjs";
import { RedirectService } from "src/app/common/services/redirect.service";
import { BackOfficeService } from "../../backoffice/services/backoffice.service";
import { SignalrService } from "../../notifications/signalr/services/signalr.service";
import { CreateProjectVacancyInput } from "../models/input/create-project-vacancy-input";
import { VacancyInput } from "../models/input/vacancy-input";
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
        private readonly _activatedRoute: ActivatedRoute,
        private readonly _backofficeService: BackOfficeService,
        private readonly _redirectService: RedirectService) { }
    public readonly vacancy$ = this._vacancyService.vacancy$;
    public readonly userProjects$ = this._backofficeService.userProjects$;

    vacancyName: string = "";
    vacancyText: string = "";
    payment: string = "";
    allFeedSubscription: any;
    projectId: number = 0;
    selectedExpirience: any = "";
    selectedEmployments: any = "";
    expirienceVariants: any= [
        { name: "Не имеет значения" },
        { name: "От 3 до 6 лет" },
        { name: "От 1 года до 3 лет" },
        { name: "Более 6 лет" },
        { name: "Нет опыта " }
    ];
    employmentsVariants: any= [
        { name: "Полная занятость" },
        { name: "Частичная занятость" }
    ];
    selectedProject: any;

    public async ngOnInit() {
         // Подключаемся.
         this._signalrService.startConnection().then(() => {
            console.log("Подключились");

            console.log(this.expirienceVariants);


            this.listenAllHubsNotifications();

            // Подписываемся на получение всех сообщений.
            this.allFeedSubscription = this._signalrService.AllFeedObservable
                .subscribe((response: any) => {
                    console.log("Подписались на сообщения", response);
                    this._messageService.add({ severity: response.notificationLevel, summary: response.title, detail: response.message });
                });
        });

        this.checkUrlParams();
        await this.getUserProjectsAsync();
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
        let model = this.createVacancyModel();
        (await this._vacancyService.createVacancyAsync(model))
        .subscribe((response: any) => {
            console.log("Новая вакансия: ", this.vacancy$.value);

            if (response.errors !== null && response.errors.length > 0) {
                response.errors.forEach((item: any) => {
                    this._messageService.add({ severity: "error", summary: "Что то не так", detail: item.errorMessage });
                });
            }

            else {
                setTimeout(() => {
                    this._router.navigate(["/vacancies/my"]).then(() => {
                        this._redirectService.redirect("vacancies/my");
                      });
                }, 4000);
            }
        });
    };

    /**
     * Функция создает вакансию вне проекта.
     * @returns - Данные вакансии.
     */
     private async createProjectVacancyAsync() {
        let model = this.createProjectVacancyModel();
        (await this._vacancyService.createProjectVacancyAsync(model))
        .subscribe((response: any) => {
            console.log("Новая вакансия проекта: ", this.vacancy$.value);

            if (response.errors !== null && response.errors.length > 0) {
                response.errors.forEach((item: any) => {
                    this._messageService.add({ severity: "error", summary: "Что то не так", detail: item.errorMessage });
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
    private createVacancyModel(): VacancyInput {
        let model = new VacancyInput();
        model.VacancyName = this.vacancyName;
        model.VacancyText = this.vacancyText;
        model.WorkExperience = this.selectedExpirience.name;
        model.Employment = this.selectedEmployments.name;
        model.Payment = this.payment;
        model.ProjectId = this.selectedProject.projectId;

        return model;
    };

    /**
     * Функция создает модель для создания вакансии проекта.
     * @returns - Входная модель вакансии.
     */
     private createProjectVacancyModel(): CreateProjectVacancyInput {
        let model = new CreateProjectVacancyInput();
        model.VacancyName = this.vacancyName;
        model.VacancyText = this.vacancyText;
        model.WorkExperience = this.selectedExpirience.name;
        model.Employment = this.selectedEmployments.name;
        model.Payment = this.payment;
        model.ProjectId = this.projectId;

        return model;
    };

    public ngOnDestroy(): void {
        (<Subscription>this.allFeedSubscription)?.unsubscribe();
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

    /**
     * Функция получает список проектов пользователя.
     * @returns Список проектов.
     */
     private async getUserProjectsAsync() {        
        (await this._backofficeService.getUserProjectsAsync())
        .subscribe(_ => {
            console.log("Проекты пользователя:", this.userProjects$.value);
        });
    };
}
