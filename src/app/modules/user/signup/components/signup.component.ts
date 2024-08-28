import { Component, OnInit } from "@angular/core";
import { UntypedFormControl, UntypedFormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { MessageService } from "primeng/api";
import { RedirectService } from "src/app/common/services/redirect.service";
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
        private readonly _router: Router,
        private readonly _messageService: MessageService,
        private readonly _redirectService: RedirectService) { }

    formSignUp: UntypedFormGroup = new UntypedFormGroup({

        "name": new UntypedFormControl("", [
            Validators.required
        ]),

        "email": new UntypedFormControl("", [
            Validators.required,
            Validators.email
        ]),

        "password": new UntypedFormControl("", [
            Validators.required,
            Validators.pattern(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&^_-]).{8,}/)
        ]),

        "componentRoles": new UntypedFormControl(""),

        "agree": new UntypedFormControl(null, [
              Validators.required
          ])
    });

    public readonly userData$ = this._userService.userData$;
    public readonly componentRoles$ = this._userService.componentRoles$;
    aComponentRoles: any[] = [];

    selectedComponentRoles: number[] = [];

    public async ngOnInit() {
      await this.getComponentRolesAsync();
    };

   /**
     * Функция регистрирует пользователя.
     * @returns - Данные пользователя.
     */
    public async onSendFormSignUpAsync() { 
        if (!this.formSignUp.valid) {
            let errors = '';
            if (this.formSignUp.controls['name']?.errors) {
                errors = "Не указано имя пользователя. ";
            }
            if (this.formSignUp.controls['email']?.errors) {
                errors += "Не указан e-mail. ";
            }
            if (this.formSignUp.controls['password']?.errors) {
                errors += "Пароль не соответствует требованиям. ";
            }
            if (this.formSignUp.controls['agree']?.errors) {
                errors += "Требуется согласие с условиями платформы.";
            }
            this._messageService.add({ 
                severity: 'error',
                summary: "Ошибка проверки формы",
                detail: errors
            });
            console.log('this.formSignUp: ', this.formSignUp);
            return;
        }
   
        (await this._userService.signUpAsync(this.formSignUp.value.email,
          this.formSignUp.value.password,
          this.formSignUp.value.componentRoles))
          .subscribe((response: any) => {
            console.log("Новый пользователь: ", this.userData$.value);
            if (response.isSuccess) {
              this._messageService.add({
                severity: 'success',
                summary: "Все хорошо",
                detail: "Ваша анкета успешно создана и отправлена на модерацию. " +
                  "Заполните свою анкету в вашем профиле, чтобы получить доступ к ключевому функционалу."
              }); 

           setTimeout(() => {
             this._router.navigate(["/user/signin"]).then(() => {
               this._redirectService.redirect("user/signin");
             });
           }, 4000);
         } else {
           response.errors.forEach((item: any) => {
             this._messageService.add({
               severity: item.customState ?? 'error',
               summary: "Что то не так",
               detail: item.errorMessage
             });
           });
         }
       });
   };

  /**
   * Функция получает компонентные роли для выбора.
   * @returns - Список компонентных ролей.
   */
  private async getComponentRolesAsync() {
    (await this._userService.getComponentRolesAsync())
      .subscribe(_=> {
        console.log("Компонентные роли к выбору: ", this.componentRoles$.value);
        this.aComponentRoles = this.componentRoles$.value;
      });
  };
}
