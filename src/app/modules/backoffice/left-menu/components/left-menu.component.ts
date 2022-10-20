import { Component, OnInit } from "@angular/core";
import { BackOfficeService } from "../../services/backoffice.service";

@Component({
    selector: "left-menu",
    templateUrl: "./left-menu.component.html",
    styleUrls: ["./left-menu.component.scss"]
})

/**
 * Класс календаря пользователя.
 */
export class LeftMenuComponent implements OnInit {
    public readonly profileItems$ = this._backOfficeService.profileItems$;

    constructor(private readonly _backOfficeService: BackOfficeService) {
    }

    public async ngOnInit() {
        await this.getProfileInfoAsync();
    }

    /**
     * Функция получает пункты меню профиля пользователя.
     * @returns Список меню.
     */
    private async getProfileInfoAsync() {
        (await this._backOfficeService.getProfileItemsAsync())
        .subscribe(_ => {
            console.log("Меню профиля: ", this.profileItems$.value);
        });
    };
}