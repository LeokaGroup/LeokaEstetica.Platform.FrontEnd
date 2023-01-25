import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { UserService } from "../../services/user.service";

@Component({
    selector: "signup",
    templateUrl: "./signup.component.html",
    styleUrls: ["./signup.component.scss"]
})

/**
 * Класс компонента формы регистрации пользователя.
 */
export class SignUpComponent implements OnInit {
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
    public async onSendFormSignUpAsync() {    
        (await this._userService.signUpAsync(this.formSignUp.value.email, this.formSignUp.value.password))
        .subscribe(_ => {
            console.log("Новый пользователь: ", this.userData$.value);
            this._router.navigate(["/user/signin"]);
        });
    };
}