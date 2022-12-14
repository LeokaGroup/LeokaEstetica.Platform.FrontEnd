import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { MessageService } from "primeng/api";
import { forkJoin } from "rxjs";
import { SignalrService } from "src/app/modules/notifications/signalr/services/signalr.service";
import { VacancyService } from "src/app/modules/vacancy/services/vacancy.service";

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
        private readonly _router: Router,
        private readonly _vacancyService: VacancyService) {
    }

    public readonly selectedVacancy$ = this._vacancyService.selectedVacancy$;

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
            });
    };
}