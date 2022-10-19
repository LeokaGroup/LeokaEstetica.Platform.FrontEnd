import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
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

    constructor(private readonly _router: Router,
        private readonly _backOfficeService: BackOfficeService) {
    }

    aProfileMenuItems = [
        {
            label: "Анкета",
            items: [
                {label: "Просмотр анкеты"},
                {label: "Изменить анкету"},
                {label: "Удалить анкету"}
            ]
        },
        {
            label: "Мои проекты",
            items: [
                {label: "Мои проекты"},
                {label: "Проекты в архиве"}
            ]
        },
        {
            label: "Команды", sysName: "Test"
        },
        {
            label: "Приглашения"
        },
        {
            label: "Баланс"
        },
        {
            label: "Сообщения"
        },
        {
            label: "Подписки"
        },
        {
            label: "Тарифы"
        },
        {
            label: "Настройки"
        },
        {
            label: "Выйти"
        }
    ];

    public async ngOnInit() {
        console.log(this.aProfileMenuItems);
        await this.getProfileInfoAsync();
    }

    private async getProfileInfoAsync() {
        (await this._backOfficeService.getProfileItemsAsync())
        .subscribe(_ => {
            console.log("Меню профиля: ", this.profileItems$.value);
        });
    };
}