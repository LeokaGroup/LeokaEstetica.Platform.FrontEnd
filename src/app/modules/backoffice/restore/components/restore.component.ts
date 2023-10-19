import { Component, OnInit } from "@angular/core";
import { forkJoin } from "rxjs";
import { SignalrService } from "src/app/modules/notifications/signalr/services/signalr.service";
import { MessageService } from "primeng/api";
import { ActivatedRoute, Router } from "@angular/router";
import { BackOfficeService } from "../../services/backoffice.service";
import { PreRestoreInput } from "../models/pre-restore-input";
import { RestoreInput } from "../models/restore-input";

@Component({
    selector: "restore",
    templateUrl: "./restore.component.html",
    styleUrls: ["./restore.component.scss"]
})

/**
 * Класс компонента восстановления пароля пользователя.
 */
export class RestoreComponent implements OnInit {
    public readonly sendedRestoreCode$ = this._backofficeService.sendedRestoreCode$;
    public readonly checkSednedRestoreCode$ = this._backofficeService.checkSednedRestoreCode$;

    allFeedSubscription: any;
    email: string = "";
    isVisibleRestorePassword: boolean = false;
    publicId: string = "";
    restorePassword: string = "";
    isVisibleCheckCode: boolean = false;
    restoreTxt: string = "Проверить почту";
    isSended: boolean = false;
    confirmCode: string = "";

    constructor(private readonly _backofficeService: BackOfficeService,
        private readonly _signalrService: SignalrService,
        private readonly _messageService: MessageService,
        private readonly _router: Router,
        private readonly _activatedRoute: ActivatedRoute) {

    }

    public async ngOnInit() {
        forkJoin([
          await this.checkUrlParams()
        ]).subscribe();

        // Подключаемся.
        this._signalrService.startConnection().then(() => {
            console.log("Подключились");

            this.listenAllHubsNotifications();
        });

        // Подписываемся на получение всех сообщений.
        this._signalrService.AllFeedObservable
            .subscribe((response: any) => {
                console.log("Подписались на сообщения", response);

                // Если пришел тип уведомления, то просто показываем его.
                if (response.notificationLevel !== undefined) {
                    this._messageService.add({ severity: response.notificationLevel, summary: response.title, detail: response.message });
                }
            });
    };

    /**
     * Функция слушает все хабы.
     */
    private listenAllHubsNotifications() {
      this._signalrService.listenSendNotificationWarningBlockedUserProfile();     
      this._signalrService.listenSendNotificationSuccessLinkRestoreUserPassword();     
      this._signalrService.listenSendNotifySuccessRestoreUserPassword();     
    };

    /**
    // * Функция отправляет ссылку для восстановления пароля на почту пользователя и выполняет восстановление.
    // * @returns - Признак успешности.
    */
    public async onRestorePasswordAsync() {
        if (!this.isVisibleRestorePassword && !this.isSended) {
            let preRestoreInput = new PreRestoreInput();
            preRestoreInput.account = this.email;
    
            (await this._backofficeService.sendCodeRestorePasswordAsync(preRestoreInput))
                .subscribe((response: any) => {
                    console.log("Отправили ссылку", response);

                    if (response.errors !== null && response.errors.length > 0) {
                        response.errors.forEach((item: any) => {
                            this._messageService.add({ severity: 'error', summary: "Что то не так", detail: item.errorMessage });
                        });

                        return;
                    }

                    // Успешно/не успешно.
                    this.isVisibleRestorePassword = false;
                    this.isVisibleCheckCode = response.isSuccess;
                    this.restoreTxt = "Проверить код";
                    this.isSended = true;
                });
        }
        
        else if (this.isVisibleCheckCode && this.isSended) {
            (await this._backofficeService.checkRestorePasswordLinkAsync(this.confirmCode, this.email))
                .subscribe((response: any) => {
                    console.log("Проверили код", response);

                    if (response.errors !== null && response.errors.length > 0) {
                        response.errors.forEach((item: any) => {
                            this._messageService.add({ severity: 'error', summary: "Что то не так", detail: item.errorMessage });
                        });

                        return;
                    }
    
                   // Успешно/не успешно.
                   this.isVisibleRestorePassword = true;
                   this.restoreTxt = "Восстановить";
                   this.isVisibleCheckCode = false;
                });
        }
        
        else if (this.isVisibleRestorePassword) {
            let restoreInput = new RestoreInput();
            restoreInput.restorePassword = this.restorePassword;
            restoreInput.userName = this.email;

            (await this._backofficeService.restorePasswordAsync(restoreInput))
                .subscribe((response: any) => {
                    console.log("Восстановили пароль", response);

                    // Если восстановили успешно, перебрасываем на вход.
                    if (response.isSuccess) {  
                        this._messageService.add({
                            severity: 'success',
                            summary: "Все хорошо",
                            detail: "Пароль успешно изменен. Теперь Вы можете войти по нему."
                        });   
        
                        setTimeout(() => {
                            this._router.navigate(["/user/signin"]);
                        }, 4000);
                    }
                });
        }
    };    

    private checkUrlParams() {
        this._activatedRoute.queryParams
        .subscribe(async params => {
            this.publicId = params["publicId"];
          });
    };
}
