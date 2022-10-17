import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
    selector: "left-menu",
    templateUrl: "./left-menu.component.html",
    styleUrls: ["./left-menu.component.scss"]
})

/**
 * Класс календаря пользователя.
 */
export class LeftMenuComponent implements OnInit {
    constructor(private readonly _router: Router) {
    }

    items = [
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
            label: "Команды"
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
        console.log(this.items);
    }
}