import { Component, OnInit } from "@angular/core";
import { UntypedFormControl, UntypedFormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { MessageService } from "primeng/api";
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
        private readonly _messageService: MessageService) {

        }

    formSignUp: UntypedFormGroup = new UntypedFormGroup({
        "email": new UntypedFormControl("", [
            Validators.required,
            Validators.email
        ]),

        "password": new UntypedFormControl("", [
            Validators.required,
            // Validators.pattern(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&^_-]).{8,}/)
        ]),

        "remember": new UntypedFormControl(0)
    });
    allFeedSubscription: any;

    public readonly userData$ = this._userService.userData$;

    public async ngOnInit() {
    };

     /**
     * Функция авторизует пользователя.
     * @returns - Данные пользователя.
     */
      public async onSendFormSignInAsync() {
        if (!this.formSignUp.valid) {
            let errors = '';
            if (this.formSignUp.controls['email']?.errors) {
                errors += "Не введен логин (e-mail). ";
            }
            if (this.formSignUp.controls['password']?.errors) {
                errors += "Не введен пароль. ";
            }
            this._messageService.add({ 
                severity: 'error',
                summary: "Ошибка проверки формы",
                detail: errors
            });
            console.log('this.formSignUp: ', this.formSignUp);
            return;
        }

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
}
