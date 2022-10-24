import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
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
        private readonly _router: Router) { }

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

    public readonly userData$ = this._userService.userData$;

    public async ngOnInit() {

    };

     /**
     * Функция регистрирует пользователя.     
     * @returns - Данные пользователя.
     */
      public async onSendFormSignInAsync() {    
        (await this._userService.signInAsync(this.formSignUp.value.email, this.formSignUp.value.password))
        .subscribe(_ => {
            console.log("Авторизовались: ", this.userData$.value);
            if (this.userData$.value.isSuccess) {
                localStorage["token"] = this.userData$.value.token;
                localStorage["u_c"] = this.userData$.value.userCode;
                this._router.navigate(["/profile/aboutme"]);
            }
        });
    };
}