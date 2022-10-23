import { Component, OnDestroy, OnInit } from "@angular/core";
import { forkJoin, Subscription } from "rxjs";
import { SCRIPTS_URLS } from "src/app/core/core-urls/scripts-urls";
import { BackOfficeService } from "../../services/backoffice.service";
import { HubConnectionBuilder } from '@microsoft/signalr';
import { API_URL } from "src/app/core/core-urls/api-urls";
import { SignalrService } from "src/app/modules/notifications/signalr/services/signalr.service";
import { Feed } from "src/app/modules/notifications/signalr/models/feed";

@Component({
    selector: "aboutme",
    templateUrl: "./aboutme.component.html",
    styleUrls: ["./aboutme.component.scss"]
})

/**
 * Класс страницы профиля пользователя (Обо мне).
 */
export class AboutmeComponent implements OnInit, OnDestroy  {
    public readonly profileSkillsItems$ = this._backofficeService.profileSkillsItems$;
    public readonly profileIntentsItems$ = this._backofficeService.profileIntentsItems$;

    isShortFirstName: boolean = false;
    phoneNumber: string = "";
    aSelectedSkills: any[] = [];
    private hubConnection: any;
    feed: Feed[] = [];
    allFeedSubscription: any;

    constructor(private readonly _backofficeService: BackOfficeService,
        private readonly signalrService: SignalrService) {

    }

    public async ngOnInit() {
        forkJoin([
            await this.getProfileSkillsAsync(),
            await this.getProfileIntentsAsync()
        ]).subscribe();

          // 1 - start a connection
    this.signalrService.startConnection().then(() => {
        console.log("connected");
  
        // 2 - register for ALL relay
        this.signalrService.listenToAllFeeds();
  
        // 3 - subscribe to messages received
        this.allFeedSubscription = this.signalrService.AllFeedObservable
              .subscribe((res: Feed) => {
                console.log("subscribe to messages received", res);
                this.feed.push(res);
              });
      });
    };

    /**
    * Функция получает список навыков пользователя для выбора.
    * @returns - Список навыков.
    */
    private async getProfileSkillsAsync() {
        (await this._backofficeService.getProfileSkillsAsync())
            .subscribe(_ => {
                console.log("Список навыков для выбора: ", this.profileSkillsItems$.value);
            });
    };

    /**
     * Функция получает список целей на платформе для выбора пользователем.
     * @returns - Список целей.
     */
    private async getProfileIntentsAsync() {
        (await this._backofficeService.getProfileIntentsAsync())
            .subscribe(_ => {
                console.log("Список целей для выбора: ", this.profileIntentsItems$.value);
            });
    };

    public startConnection() {
        return new Promise((resolve, reject) => {
            this.hubConnection = new HubConnectionBuilder()
                .withUrl(API_URL.apiUrl +"/notify").build();

            this.hubConnection.start()
                .then(() => {
                    console.log("connection established");
                    return resolve(true);
                })
                .catch((err: any) => {
                    console.log("error occured" + err);
                    reject(err);
                });
        });
    };

    ngOnDestroy(): void {
        (<Subscription>this.allFeedSubscription).unsubscribe();
      }
}