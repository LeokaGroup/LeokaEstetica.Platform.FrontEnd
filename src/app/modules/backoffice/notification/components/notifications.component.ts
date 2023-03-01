import { Component, OnInit } from "@angular/core";
import { forkJoin } from "rxjs";
import { Router } from "@angular/router";
import { NotificationsService } from "../services/notifications.service";
import { ApproveProjectInviteInput } from "../models/input/approve-project-invite-input";

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

    public async onApproveProjectInviteAsync(notificationId: number) {
        console.log(notificationId);
        let approveProjectInviteInput = new ApproveProjectInviteInput();
        approveProjectInviteInput.NotificationId = notificationId;

        (await this._notificationsService.approveProjectInviteAsync(approveProjectInviteInput))
        .subscribe(async _ => {
            console.log("Подтвердили инвайт: ");
            await this.getUserNotificationsAsync();
        });
    };
}