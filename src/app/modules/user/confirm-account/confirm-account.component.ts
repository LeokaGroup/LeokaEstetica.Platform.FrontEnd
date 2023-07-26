import { Component, OnInit } from "@angular/core";
import { UserService } from "../services/user.service";

@Component({
    selector: "confirm-account",
    templateUrl: "./confirm-account.component.html",
    styleUrls: ["./confirm-account.component.scss"]
})

/**
 * Класс компонента подтверждения аккаунта пользователя.
 */
export class ConfirmComponent implements OnInit {
    constructor(private readonly _userService: UserService) { }   
    
    public readonly confirmAccount$ = this._userService.confirmAccount$;

    public async ngOnInit() {
        await this.confirmEmailCodeAsync();
    };

   /**
     * Функция подтверждает аккаунт по коду.     
     * @returns - Статус подтверждения.
     */
    private async confirmEmailCodeAsync() {    
        (await this._userService.confirmEmailCodeAsync(window.location.search.replace("?code=", "")))
        .subscribe(_ => {
            console.log("Аккаунт подтвержден: ", this.confirmAccount$.value);
        });
    };
}