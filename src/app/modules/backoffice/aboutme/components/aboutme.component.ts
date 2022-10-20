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
    public readonly profileSkillsItems$ = this._backofficeService.profileSkillsItems$;

    isShortFirstName: boolean = false;
    phoneNumber: string = "";

    constructor(private readonly _backofficeService: BackOfficeService) {
    }

    public async ngOnInit() {
        await this.getProfileSkillsAsync();
    }

     /**
     * Функция получает список навыков пользователя для выбора.
     * @returns - Список навыков.
     */
    private async getProfileSkillsAsync() {
        (await this._backofficeService.getProfileSkillsAsync())
        .subscribe(_ => {
            console.log("Список навыков для выбора: ", this.profileSkillsItems$.value);
        });
    };
}