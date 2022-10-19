import { Component, OnInit } from "@angular/core";
import { BackOfficeService } from "../../services/backoffice.service";

@Component({
    selector: "aboutme",
    templateUrl: "./aboutme.component.html",
    styleUrls: ["./aboutme.component.scss"]
})

/**
 * Класс страницы профиля пользователя (Обо мне).
 */
export class AboutmeComponent implements OnInit {
    public readonly profileInfoData$ = this._backofficeService.profileInfoData$;

    isShortFirstName: boolean = false;
    phoneNumber: string = "";

    constructor(private readonly _backofficeService: BackOfficeService) {
    }

    public async ngOnInit() {
        await this.getProfileInfoAsync();
    }

     /**
     * Функция получает информацию о профиля для раздела обо мне.
     * @returns - Данные обо мне.
     */
    private async getProfileInfoAsync() {
        (await this._backofficeService.getProfileInfoAsync())
        .subscribe(_ => {
            console.log("Данные обо мне: ", this.profileInfoData$.value);
        });
    };
}