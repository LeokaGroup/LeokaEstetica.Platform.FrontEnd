import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { MessageService } from "primeng/api";
import { forkJoin } from "rxjs";
import { RedirectService } from "src/app/common/services/redirect.service";
import { SignalrService } from "src/app/modules/notifications/signalr/services/signalr.service";
import { VacancyService } from "src/app/modules/vacancy/services/vacancy.service";
import { VacancyInput } from "../models/input/vacancy-input";

@Component({
    selector: "detail",
    templateUrl: "./detail.component.html",
    styleUrls: ["./detail.component.scss"]
})

/**
 * Класс деталей вакансии (используется для изменения и просмотра вакансии).
 */
export class DetailVacancyComponent implements OnInit {
    constructor(private readonly _activatedRoute: ActivatedRoute,
        private readonly _signalrService: SignalrService,
        private readonly _messageService: MessageService,
        private readonly _vacancyService: VacancyService,
        private readonly _router: Router,
        private readonly _redirectService: RedirectService) {
    }

    public readonly selectedVacancy$ = this._vacancyService.selectedVacancy$;
    public readonly deleteVacancy$ = this._vacancyService.deleteVacancy$;

    projectName: string = "";
    projectDetails: string = "";
    allFeedSubscription: any;
    isEditMode: boolean = false;
    isEdit: any;    
    selectedVacancy: any;
    vacancyName: string = "";
    vacancyText: string = "";
    workExperience: string = "";
    employment: string = "";
    payment: string = "";
    vacancyId: number = 0;
    isDeleteVacancy: boolean = false;
    isVisibleDeleteButton: boolean = false;
    isVisibleSaveButton: boolean = false;
    isVisibleEditButton: boolean = false;

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
        this._signalrService.listenSuccessCreatedUserVacancyInfo();
    };

    private checkUrlParams() {
        this._activatedRoute.queryParams
        .subscribe(params => {
            let mode = params["mode"];

            if (mode == "view") {
                this.getVacancyByIdAsync(params["vacancyId"]);  
                this.isEditMode = false;
            }

            if (mode == "edit") {
                this.getVacancyByIdAsync(params["vacancyId"]);             
                this.isEditMode = true;   
            }

            this.vacancyId = params["vacancyId"];
          });
    };

    public onSelectVacancy() {
        console.log(this.selectedVacancy);
    };

    /**
     * Функция получает вакансию.
     * @param vacancyId - Id вакансии.
     */
    private async getVacancyByIdAsync(vacancyId: number) {
        (await this._vacancyService.getVacancyByIdAsync(vacancyId))
            .subscribe(async _ => {
                console.log("Получили вакансию: ", this.selectedVacancy$.value);
                this.vacancyName = this.selectedVacancy$.value.vacancyName;
                this.vacancyText = this.selectedVacancy$.value.vacancyText;
                this.workExperience = this.selectedVacancy$.value.workExperience;
                this.employment = this.selectedVacancy$.value.employment;
                this.payment = this.selectedVacancy$.value.payment;
                this.isVisibleDeleteButton = this.selectedVacancy$.value.isVisibleDeleteButton;
                this.isVisibleSaveButton = this.selectedVacancy$.value.isVisibleSaveButton;
                this.isVisibleEditButton = this.selectedVacancy$.value.isVisibleEditButton;
            });
    };

    /**
     * Функция удаляет вакансию.
     * @param vacancyId - Id вакансии.
     */
    public async onDeleteVacancyAsync() {
        (await this._vacancyService.deleteVacancyAsync(this.vacancyId))
            .subscribe(async _ => {
                console.log("Удалили вакансию: ", this.deleteVacancy$.value);
                this.isDeleteVacancy = false;

                setTimeout(() => {
                    this._router.navigate(["/vacancies"])
                    .then(() => {
                        this._redirectService.redirect("profile/projects/my");      
                    });
                }, 4000);
            });
    };

    public onEditVacancy(): void {
        let vacancyId = this.vacancyId;

        this._router.navigate(["/vacancies/vacancy"], {
            queryParams: {
                vacancyId,
                mode: "edit"
            }
        });
    };

    /**
      * TODO: Вынести куда-нибудь, а то дублируется с вакансиями вне проекта.
     * Функция обновляет вакансию.
     * @returns - Данные вакансии.
     */
     public async onUpdateVacancyAsync() {
        let model = this.createUpdateVacancyModel();

        (await this._vacancyService.updateVacancyAsync(model))
        .subscribe((response: any) => {
            if (response.errors !== null && response.errors.length > 0) {
                response.errors.forEach((item: any) => {
                    this._messageService.add({ severity: 'error', summary: "Что то не так", detail: item.errorMessage });
                });
            }
        });
    };

    /**
     * TODO: Вынести куда-нибудь, а то дублируется с вакансиями вне проекта.
     * Функция создает модель для обновления вакансии проекта.
     * @returns - Входная модель вакансии.
     */
     private createUpdateVacancyModel(): VacancyInput {
        let model = new VacancyInput();
        model.VacancyName = this.vacancyName;
        model.VacancyText = this.vacancyText;
        model.Employment = this.employment;
        model.Payment = this.payment;
        model.WorkExperience = this.workExperience;
        model.VacancyId = this.vacancyId;

        return model;
    };
}