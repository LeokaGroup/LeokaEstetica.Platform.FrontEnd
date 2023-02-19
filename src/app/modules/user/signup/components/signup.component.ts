import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { UserService } from "../../services/user.service";
import {MessageService} from "primeng/api";

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
        private readonly _router: Router,private readonly _messageService: MessageService) { }

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

    public async ngOnInit() {};


  /**
   * Функция регистрирует пользователя.
   * @returns - Данные пользователя.
   */
  public async onSendFormSignUpAsync() {
    (await this._userService.signUpAsync(this.formSignUp.value.email, this.formSignUp.value.password))
      .subscribe((response: any) =>  {
        if (this.userData$.value.errors == null) {
          console.log("Новый пользователь: ", this.userData$.value);
          this._router.navigate(["/user/signin"]);
        }
        else {
          console.log("errors validate", response);
          response.errors.forEach((item: any) => {
            this._messageService.add({ severity: 'error', summary: "Что то не так", detail: item.errorMessage });
          });
        }
      });
  }
}
