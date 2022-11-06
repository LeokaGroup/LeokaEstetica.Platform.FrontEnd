import { Component, OnDestroy, OnInit } from "@angular/core";
import { forkJoin, Subscription } from "rxjs";
import { SignalrService } from "src/app/modules/notifications/signalr/services/signalr.service";
import { ActivatedRoute } from "@angular/router";
import { MessageService } from "primeng/api";
import { BackOfficeService } from "../../../services/backoffice.service";

@Component({
    selector: "my-projects",
    templateUrl: "./my-projects.component.html",
    styleUrls: ["./my-projects.component.scss"]
})

/**
 * Класс проектов пользователя.
 */
export class MyProjectsComponent implements OnInit, OnDestroy {
    public readonly projectColumns$ = this._backofficeService.projectColumns$;

    allFeedSubscription: any;
    products: any[] = [];

    constructor(private readonly _backofficeService: BackOfficeService,
        private readonly _signalrService: SignalrService,
        private readonly _activatedRoute: ActivatedRoute,
        private readonly _messageService: MessageService) {

    }

    public async ngOnInit() {
        forkJoin([
           await this.getProjectsColumnNamesAsync()
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

        // this.checkUrlParams();
    };

    /**
     * Функция слушает все хабы.
     */
    private listenAllHubsNotifications() {

    };

    // private checkUrlParams() {
    //     this._activatedRoute.queryParams
    //     .subscribe(params => {
    //         let mode = params["mode"];
    //         console.log("mode: ", mode);

    //         if (mode == "view") {
    //             this.isModeView = true;
    //         }
    //         else {
    //             this.isModeView = false;
    //         }

    //         if (mode == "edit") {
    //             this.isModeEdit = true;
    //             this.setEditFields();
    //         }

    //         else {
    //             this.isModeEdit = false;
    //         }
    //       });
    // };

    // /**
    //  * Функция подтягивает данные в поля анкеты в режиме изменения.
    //  */
    // private setEditFields() {
    //     this.firstName = this.profileInfo$.value.firstName;
    //     this.lastName = this.profileInfo$.value.lastName;
    //     this.patronymic = this.profileInfo$.value.patronymic;
    //     this.aboutme = this.profileInfo$.value.aboutme;
    //     this.email = this.profileInfo$.value.email;
    //     this.isShortFirstName = this.profileInfo$.value.isShortFirstName;
    //     this.job = this.profileInfo$.value.job;
    //     this.phoneNumber = this.profileInfo$.value.phoneNumber;
    //     this.telegram = this.profileInfo$.value.telegram;
    //     this.whatsApp = this.profileInfo$.value.whatsApp;
    //     this.vkontakte = this.profileInfo$.value.vkontakte;
    //     this.otherLink = this.profileInfo$.value.otherLink;
    // };

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

    // /**
    //  * Функция сохраняет данные профиля пользователя.
    //  * @returns - Сохраненные данные.
    //  */
    // public async onSaveProfileInfoAsync() {
    //     let model = this.createProfileInfoModel();
    //     console.log("ProfileInfoInput", model);

    //     (await this._backofficeService.saveProfileInfoAsync(model))
    //     .subscribe((response: any) => {
    //         console.log("Данные анкеты: ", this.profileInfo$.value);

    //         if (!response.isSuccess) {
    //             response.errors.forEach((item: any) => {
    //                 this._messageService.add({ severity: 'error', summary: "Что то не так", detail: item });
    //             });    
    //         }
    //     });
    // };

    public ngOnDestroy(): void {
        (<Subscription>this.allFeedSubscription).unsubscribe();
    };
}