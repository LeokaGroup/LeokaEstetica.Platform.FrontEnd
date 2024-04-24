import { Component, OnInit } from "@angular/core";
import { MessageService } from "primeng/api";
import { forkJoin } from "rxjs";
import { SignalrService } from "../../notifications/signalr/services/signalr.service";
import { ProjectManagmentService } from "../../project-managment/services/project-managment.service";
import { LandingService } from "../services/landing.service";

@Component({
    selector: "landing",
    templateUrl: "./landing.component.html",
    styleUrls: ["./landing.component.scss"]
})

/**
 * Класс компонента лендоса.
 */
export class LandingComponent implements OnInit {
    public readonly fonData$ = this._landingService.fonData$;
    public readonly platformOffers$ = this._landingService.platformOffers$;
    public readonly timelines$ = this._landingService.timelines$;
    public readonly knowledgeLanding$ = this._landingService.knowledgeLanding$;
    public readonly newUsers$ = this._landingService.newUsers$;
    public readonly lastProjectComments$ = this._landingService.lastProjectComments$;
    public readonly platformCondituions$ = this._landingService.platformCondituions$;
    public readonly availableProjectManagment$ = this._projectManagmentService.availableProjectManagment$;

    aCreateProject: any[] = [];
    aSearchProject: any[] = [];
    aCreateVacancy: any[] = [];
    aSearchVacancy: any[] = [];
    aSearchTeam: any[] = [];
    allFeedSubscription: any;
    responsiveOptions: boolean = true;
    aNewUsers: any[] = [];
    carouselType: string = "";

    constructor(private readonly _landingService: LandingService,
        private readonly _signalrService: SignalrService,
        private readonly _messageService: MessageService,
        private readonly _projectManagmentService: ProjectManagmentService) {
    }

    public async ngOnInit() {
        forkJoin([
            await this.getFonLandingStartAsync(),
            await this.getPlatformOffersAsync(),
            await this.getTimelinesAsync(),
            await this.getKnowledgeLandingAsync(),
            // await this.getNewUsersAsync(),
            await this.getLastProjectCommentsAsync(),
            await this.getPlatformConditionsAsync()
            // await this.availableProjectManagmentAsync() // TODO: Закоментил пока не починим.
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

        // Планшеты.
        if (window.matchMedia('screen and (min-width: 600px) and (max-width: 992px)').matches) {
            this.carouselType = "vertical";
        }
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

    /**
     * Функция получает список частых вопросов.
     * @returns - Список частых вопросов.
     */
     private async getNewUsersAsync() {
        (await this._landingService.getNewUsersAsync())
        .subscribe(_ => {
            console.log("Список новых пользователей: ", this.newUsers$.value);
            this.aNewUsers = this.newUsers$.value.newUsers;
        });
    };

    /**
     * Функция получает последние 5 комментариев к проектам.
     * Проекты не повторяются.
     * @returns - Список комментариев.
     */
     private async getLastProjectCommentsAsync() {
        (await this._landingService.getLastProjectCommentsAsync())
        .subscribe(_ => {
            console.log("Последние комментарии к проектам: ", this.lastProjectComments$.value);
        });
    };

     /**
     * Функция получает преимущества платформы.
     * @returns - Преимущества платформы.
     */
      private async getPlatformConditionsAsync() {
        (await this._landingService.getPlatformConditionsAsync())
        .subscribe(_ => {
            console.log("Преимущества платформы: ", this.platformCondituions$.value);
        });
    };

        /**
* Функция получает список проектов пользователя.
* @returns - Список проектов.
*/
private async availableProjectManagmentAsync() {
    (await this._projectManagmentService.availableProjectManagmentAsync())
        .subscribe(_ => {
            console.log("Доступность модуля УП: ", this.availableProjectManagment$.value);
        });
};

    public onCreateInviteLinkTelegramAsync() {
        window.location.href = "https://t.me/leoka_estetica";
    };
}
