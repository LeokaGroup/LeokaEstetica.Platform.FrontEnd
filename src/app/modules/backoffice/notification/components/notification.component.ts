import { Component, OnInit } from "@angular/core";
import { forkJoin } from "rxjs";
import { Router } from "@angular/router";

@Component({
    selector: "notifications",
    templateUrl: "./notifications.component.html",
    styleUrls: ["./notifications.component.scss"]
})

/**
 * Класс проектов пользователя.
 */
export class NotificationsComponent implements OnInit {
    // public readonly projectColumns$ = this._backofficeService.projectColumns$;

    constructor(private readonly _router: Router) {

    }

    public async ngOnInit() {
        forkJoin([
          
        ]).subscribe();
    };

    /**
    // * Функция получает поля таблицы проектов пользователя.
    // * @returns - Список полей.
    */
    // private async getProjectsColumnNamesAsync() {
    //     (await this._backofficeService.getProjectsColumnNamesAsync())
    //         .subscribe(_ => {
    //             console.log("Столбцы таблицы проектов пользователя: ", this.projectColumns$.value);
    //         });
    // };
}