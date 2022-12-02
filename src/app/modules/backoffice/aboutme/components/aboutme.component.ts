import { Component, OnDestroy, OnInit } from "@angular/core";
import { forkJoin, Subscription } from "rxjs";
import { BackOfficeService } from "../../services/backoffice.service";
import { SignalrService } from "src/app/modules/notifications/signalr/services/signalr.service";
import { ProfileInfoInput } from "../models/input/profile-info-input";
import { ActivatedRoute } from "@angular/router";
import { MessageService } from "primeng/api";

@Component({
    selector: "aboutme",
    templateUrl: "./aboutme.component.html",
    styleUrls: ["./aboutme.component.scss"]
})

/**
 * Класс страницы профиля пользователя (Обо мне).
 */
export class AboutmeComponent implements OnInit, OnDestroy {
    public readonly profileSkillsItems$ = this._backofficeService.profileSkillsItems$;
    public readonly profileIntentsItems$ = this._backofficeService.profileIntentsItems$;
    public readonly profileInfo$ = this._backofficeService.profileInfo$;
    public readonly selectedSkillsItems$ = this._backofficeService.selectedSkillsItems$;
    public readonly selectedIntentsItems$ = this._backofficeService.selectedIntentsItems$;

    isShortFirstName: boolean = false;
    phoneNumber!: string;
    aSelectedSkills: any[] = [];
    aSelectedIntents: any[] = [];
    allFeedSubscription: any;
    lastName!: string;
    firstName!: string;
    patronymic!: string;
    telegram!: string;
    whatsApp!: string;
    vkontakte!: string;
    otherLink!: string;
    aboutme!: string;
    job!: string;
    email!: string;
    experience!: string;
    isModeView!: boolean;
    isModeEdit!: boolean;

    constructor(private readonly _backofficeService: BackOfficeService,
        private readonly _signalrService: SignalrService,
        private readonly _activatedRoute: ActivatedRoute,
        private readonly _messageService: MessageService) {

    }

    public async ngOnInit() {
        forkJoin([
            await this.getProfileSkillsAsync(),
            await this.getProfileIntentsAsync(),
            await this.getProfileInfoAsync(),
            await this.getSelectedUserSkillsAsync(),
            await this.getSelectedUserIntentsAsync()
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

        this.checkUrlParams();
    };

    /**
     * Функция слушает все хабы.
     */
    private listenAllHubsNotifications() {
        // Слушаем уведомления о сохранении профиля.
        this._signalrService.listenSuccessSaveProfileInfo();

        // Слушаем уведомления о навыках пользователя.
        this._signalrService.listenWarningUserSkillsInfo();

        // Слушаем уведомления о целях пользователя.
        this._signalrService.listenWarningUserIntentsInfo();
    };

    private checkUrlParams() {
        this._activatedRoute.queryParams
        .subscribe(params => {
            let mode = params["mode"];
            console.log("mode: ", mode);

            if (mode == "view") {
                this.isModeView = true;
            }
            else {
                this.isModeView = false;
            }

            if (mode == "edit") {
                this.isModeEdit = true;
                this.setEditFields();
            }

            else {
                this.isModeEdit = false;
            }
          });
    };

    /**
     * Функция подтягивает данные в поля анкеты в режиме изменения.
     */
    private setEditFields() {
        this.firstName = this.profileInfo$.value.firstName;
        this.lastName = this.profileInfo$.value.lastName;
        this.patronymic = this.profileInfo$.value.patronymic;
        this.aboutme = this.profileInfo$.value.aboutme;
        this.email = this.profileInfo$.value.email;
        this.isShortFirstName = this.profileInfo$.value.isShortFirstName;
        this.job = this.profileInfo$.value.job;
        this.phoneNumber = this.profileInfo$.value.phoneNumber;
        this.telegram = this.profileInfo$.value.telegram;
        this.whatsApp = this.profileInfo$.value.whatsApp;
        this.vkontakte = this.profileInfo$.value.vkontakte;
        this.otherLink = this.profileInfo$.value.otherLink;
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

    /**
     * Функция сохраняет данные профиля пользователя.
     * @returns - Сохраненные данные.
     */
    public async onSaveProfileInfoAsync() {
        let model = this.createProfileInfoModel();
        console.log("ProfileInfoInput", model);

        (await this._backofficeService.saveProfileInfoAsync(model))
        .subscribe((response: any) => {
            console.log("Данные анкеты: ", this.profileInfo$.value);

            if (response.errors.length > 0) {
                response.errors.forEach((item: any) => {
                    this._messageService.add({ severity: 'error', summary: "Что то не так", detail: item.errorMessage });
                });    
            }
        });
    };

    /**
     * Функция создает входную модель для сохранения данных профиля пользователя.
     * @returns - Данные модели для сохранения.
     */
    private createProfileInfoModel(): ProfileInfoInput {
        let profileInfoInput = new ProfileInfoInput();
        profileInfoInput.FirstName = this.firstName;
        profileInfoInput.LastName = this.lastName;
        profileInfoInput.Patronymic = this.patronymic;
        profileInfoInput.Aboutme = this.aboutme;
        profileInfoInput.Email = this.email;
        profileInfoInput.IsShortFirstName = this.isShortFirstName;
        profileInfoInput.Job = this.job;
        profileInfoInput.PhoneNumber = this.phoneNumber;
        profileInfoInput.Telegram = this.telegram;
        profileInfoInput.WhatsApp = this.whatsApp;
        profileInfoInput.Vkontakte = this.vkontakte;
        profileInfoInput.OtherLink = this.otherLink;
        profileInfoInput.UserSkills = this.aSelectedSkills;
        profileInfoInput.UserIntents = this.aSelectedIntents;

        return profileInfoInput;
    };

    /**
     * Функция получает данные профиля пользователя.
     * @returbs - Данные анкеты.
     */
    private async getProfileInfoAsync() {
        (await this._backofficeService.getProfileInfoAsync())
        .subscribe(_ => {
            console.log("Данные анкеты: ", this.profileInfo$.value);
            this.setEditFields();
        });
    };

    public async onSaveProfileUserSkillsAsync() {
        console.log("selected skills: ", this.aSelectedSkills);
    };

     /**
    * Функция получает список выбранных навыков пользователя.
    * @returns - Список навыков.
    */
      private async getSelectedUserSkillsAsync() {
        (await this._backofficeService.getSelectedUserSkillsAsync())
            .subscribe(_ => {
                console.log("Список выбранных навыков: ", this.selectedSkillsItems$.value);
                this.aSelectedSkills = this.selectedSkillsItems$.value;
            });
    };

     /**
    * Функция получает список выбранных целей пользователя.
    * @returns - Список навыков.
    */
      private async getSelectedUserIntentsAsync() {
        (await this._backofficeService.getSelectedUserIntentsAsync())
            .subscribe(_ => {
                console.log("Список выбранных целей: ", this.selectedIntentsItems$.value);
                this.aSelectedIntents = this.selectedIntentsItems$.value;
            });
    };

    public ngOnDestroy(): void {
        (<Subscription>this.allFeedSubscription).unsubscribe();
    };
}