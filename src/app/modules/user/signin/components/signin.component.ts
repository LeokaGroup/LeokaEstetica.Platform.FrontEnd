import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { MessageService } from "primeng/api";
import { SignalrService } from "src/app/modules/notifications/signalr/services/signalr.service";
import { UserService } from "../../services/user.service";

@Component({
    selector: "signin",
    templateUrl: "./signin.component.html",
    styleUrls: ["./signin.component.scss"]
})

/**
 * Класс компонента формы авторизации пользователя.
 */
export class SignInComponent implements OnInit {
    constructor(private readonly _userService: UserService,
        private readonly _router: Router,
        private readonly _messageService: MessageService,
        private readonly _signalrService: SignalrService) { }

    formSignUp: FormGroup = new FormGroup({
        "email": new FormControl("", [
            Validators.required,
            Validators.email
        ]),

        "password": new FormControl("", [
            Validators.required,
            Validators.pattern(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&^_-]).{8,}/)
        ])
    });
    allFeedSubscription: any;
    isAuthGoogle: boolean = false;
    isAuthVk: boolean = false;

    public readonly userData$ = this._userService.userData$;

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

        this.checkVisibleProviderAuth();
    };

    /**
    * Функция слушает все хабы.
    */
    private listenAllHubsNotifications() {
        this._signalrService.listenWarningBlockedUser();
    };


     /**
     * Функция регистрирует пользователя.     
     * @returns - Данные пользователя.
     */
      public async onSendFormSignInAsync() {    
        (await this._userService.signInAsync(this.formSignUp.value.email, this.formSignUp.value.password))
        .subscribe((response: any) => {
            console.log("Авторизовались: ", this.userData$.value);
            if (!this.userData$.value.errors.length || this.userData$.value.errors == null) {
                localStorage["t_n"] = this.userData$.value.token;
                localStorage["u_c"] = this.userData$.value.userCode;
                localStorage["u_e"] = this.userData$.value.email;
                
                this._router.navigate(["/profile/aboutme"], {
                    queryParams: {
                        mode: "view"
                    }
                });
            }

            else {
                console.log("errors validate", response);
                response.errors.forEach((item: any) => {
                    this._messageService.add({ severity: item.customState ?? 'error', summary: "Что то не так", detail: item.errorMessage });
                });                
            }
        });
    };

    /**
     * Функция настраивает видимость авторизации через провайдеров Google, VK.
     */
    private checkVisibleProviderAuth() {
        let currentRoute = this._router.url;

        // Если есть токен, то не показывать.
        if (localStorage["t_n"] && currentRoute !== "/user/signin") {
            this.isAuthGoogle = false;
            this.isAuthVk = false;
        }

        else if (!localStorage["t_n"] && currentRoute === "/user/signin") {
            this.isAuthGoogle = true;
            this.isAuthVk = true;
        }
    };
}