import { Component, OnInit } from "@angular/core";
import { forkJoin } from "rxjs";
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
    public readonly profileIntentsItems$ = this._backofficeService.profileIntentsItems$;

    isShortFirstName: boolean = false;
    phoneNumber: string = "";
    aSelectedSkills: any[] = [];

    constructor(private readonly _backofficeService: BackOfficeService) {
    }

    public async ngOnInit() {
        forkJoin([
            await this.getProfileSkillsAsync(),
            await this.getProfileIntentsAsync()
        ]).subscribe();    
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

    /**
     * Функция получает список целей на платформе для выбора пользователем.
     * @returns - Список целей.
     */
    private async getProfileIntentsAsync() {
        (await this._backofficeService.getProfileIntentsAsync())
        .subscribe(_ => {
            console.log("Список целей для выбора: ", this.profileIntentsItems$.value);
        });
    };
}