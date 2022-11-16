import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { UserService } from "../../user/services/user.service";

@Component({
    selector: "create",
    templateUrl: "./create.component.html",
    styleUrls: ["./create.component.scss"]
})

/**
 * Класс компонента создания вакансии.
 */
export class CreateVacancyComponent implements OnInit {
    constructor(private readonly _userService: UserService,
        private readonly _router: Router) { }
    public readonly userData$ = this._userService.userData$;

    vacancyName: string = "";
    vacancyText: string = "";
    workExperience: string = "";
    employment: string = "";
    payment: string = "";

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