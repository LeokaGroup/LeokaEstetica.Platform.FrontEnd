import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { UserService } from "../../../user/services/user.service";

@Component({
    selector: "catalog",
    templateUrl: "./catalog-vacancy.component.html",
    styleUrls: ["./catalog-vacancy.component.scss"]
})

/**
 * Класс компонента каталога вакансий.
 */
export class CatalogVacancyComponent implements OnInit {
    constructor(private readonly _userService: UserService,
        private readonly _router: Router) { }

    formSignUp: FormGroup = new FormGroup({

        "email": new FormControl("", [
            Validators.required,
            Validators.email
        ])
    });

    public readonly userData$ = this._userService.userData$;

    public async ngOnInit() {
        
    };

   /**
     * Функция регистрирует пользователя.     
     * @returns - Данные пользователя.
     */
    // public async onSendFormSignUpAsync() {    
    //     (await this._userService.signUpAsync(this.formSignUp.value.email, this.formSignUp.value.password))
    //     .subscribe(_ => {
    //         console.log("Новый пользователь: ", this.userData$.value);
    //         this._router.navigate(["/user/signin"]);
    //     });
    // };
}