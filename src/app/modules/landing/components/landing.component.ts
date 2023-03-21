import { Component, OnInit } from "@angular/core";
import { MessageService } from "primeng/api";
import { forkJoin } from "rxjs";
import { SignalrService } from "../../notifications/signalr/services/signalr.service";
import { LandingService } from "../services/landing.service";

@Component({
    selector: "landing",
    templateUrl: "./landing.component.html",
    styleUrls: ["./landing.component.scss"]
})

/**
 * Класс календаря пользователя.
 */
export class LandingComponent implements OnInit {
    public readonly fonData$ = this._landingService.fonData$;
    public readonly platformOffers$ = this._landingService.platformOffers$;    
    public readonly timelines$ = this._landingService.timelines$;    
    public readonly knowledgeLanding$ = this._landingService.knowledgeLanding$;    

    aCreateProject: any[] = [];
    aSearchProject: any[] = [];
    aCreateVacancy: any[] = [];
    aSearchVacancy: any[] = [];
    aSearchTeam: any[] = [];    
    allFeedSubscription: any;

    constructor(private readonly _landingService: LandingService,
        private readonly _signalrService: SignalrService,
        private readonly _messageService: MessageService) {
    }

    public async ngOnInit() {
        forkJoin([
            await this.getFonLandingStartAsync(),
            await this.getPlatformOffersAsync(),
            await this.getTimelinesAsync(),
            await this.getKnowledgeLandingAsync()
        ]).subscribe();        

        // Подключаемся.
        this._signalrService.startConnection().then(async () => {
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
     * Функция получает данные фона главного лендинга.
     * @returns - Данные фона.
     */
    private async getFonLandingStartAsync() {
        (await this._landingService.getFonLandingStartAsync())
        .subscribe(_ => {
            console.log("Данные фона лендинга: ", this.fonData$.value);
        });
    };

    /**
     * Функция получает данные предложений платформы.
     * @returns - Данные предложений платформы.
     */
    private async getPlatformOffersAsync() {
        (await this._landingService.getPlatformOffersAsync())
        .subscribe(_ => {
            console.log("Список предложений платформы: ", this.platformOffers$.value);
        });
    };

    /**
     * Функция получает список таймлайнов.
     * @returns - Список таймлайнов.
     */
     private async getTimelinesAsync() {
        (await this._landingService.getTimelinesAsync())
        .subscribe(_ => {
            console.log("Список таймлайнов: ", this.timelines$.value);
            this.fillTimelines();            
        });
    };

    private fillTimelines(): void {
        let timelines = this.timelines$.value;
        this.aSearchProject = timelines.SearchProject;
        this.aCreateProject = timelines.CreateProject;
        this.aSearchVacancy = timelines.SearchVacancy;
        this.aCreateVacancy = timelines.CreateVacancy;
        this.aSearchTeam = timelines.SearchTeam;
    };

     /**
     * Функция получает список частых вопросов.
     * @returns - Список частых вопросов.
     */
     private async getKnowledgeLandingAsync() {
        (await this._landingService.getKnowledgeLandingAsync())
        .subscribe(_ => {
            console.log("Список частых вопросов: ", this.knowledgeLanding$.value);       
        });
    };

    /**
     * Функция слушает все хабы.
     */
     private listenAllHubsNotifications() {
        this._signalrService.listenWarningEmptyUserProfile();
    };
}