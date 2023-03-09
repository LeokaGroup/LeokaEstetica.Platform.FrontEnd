import { DOCUMENT } from "@angular/common";
import { Component, Inject, OnInit, Renderer2 } from "@angular/core";
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
 @Inject(DOCUMENT)
export class SignInComponent implements OnInit {
    constructor(private readonly _userService: UserService,
        private readonly _router: Router,
        private readonly _messageService: MessageService,
        private readonly _signalrService: SignalrService,
        private readonly _document: Document,
        private readonly _renderer2: Renderer2) { }

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

        const textScript = this._renderer2.createElement('script');
        textScript.src = 'https://accounts.google.com/gsi/client';
        textScript.setAttribute("async ", "async ");
        textScript.setAttribute("defer", "defer");
        this._renderer2.appendChild(this._document.body, textScript);
    
        const srcScript = this._renderer2.createElement('script');
        srcScript.type = 'text/javascript';
        srcScript.text = `
        function handleCredentialResponse(response) {
            console.log("Encoded JWT ID token: " + response.credential);
          }

          window.onload = function () {
            google.accounts.id.initialize({
              client_id: "418999951875-s1smtv8oitn579i8pd4na059pnbctf19.apps.googleusercontent.com",
              callback: handleCredentialResponse
            });
            google.accounts.id.renderButton(
              document.getElementById("buttonDiv"),
              { theme: "outline", size: "large" } 
            );
            google.accounts.id.prompt(); 
          }
        `;
        this._renderer2.appendChild(this._document.body, srcScript);
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
}