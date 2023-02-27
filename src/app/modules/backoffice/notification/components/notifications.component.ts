import { Component, OnInit } from "@angular/core";
import { forkJoin } from "rxjs";
import { Router } from "@angular/router";
import { NotificationsService } from "../services/notifications.service";

@Component({
    selector: "notifications",
    templateUrl: "./notifications.component.html",
    styleUrls: ["./notifications.component.scss"]
})

/**
 * Класс уведомлений пользователя.
 */
export class NotificationsComponent implements OnInit {
    public readonly userNotifications$ = this._notificationsService.userNotifications$;

    constructor(private readonly _router: Router,
        private readonly _notificationsService: NotificationsService) {

    }

    public async ngOnInit() {
        forkJoin([
          await this.getUserNotificationsAsync()
        ]).subscribe();
    };
    
    /**
     * Функция получает список уведомлений пользователя.
     * @returns - Список уведомлений.
     */
    private async getUserNotificationsAsync() {
        (await this._notificationsService.getUserNotificationsAsync())
            .subscribe(_ => {
                console.log("Уведомления пользователя: ", this.userNotifications$.value);
            });
    };
}