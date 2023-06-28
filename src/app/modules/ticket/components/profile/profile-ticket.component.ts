import { Component, OnInit } from "@angular/core";
import { forkJoin } from "rxjs";
import { TicketService } from "../../services/ticket.service";

@Component({
    selector: "profile-ticket",
    templateUrl: "./profile-ticket.component.html",
    styleUrls: ["./profile-ticket.component.scss"]
})

/**
 * Класс компонента тикетов в ЛК.
 */
export class ProfileTicketComponent implements OnInit {
    constructor(private readonly _ticketService: TicketService) {
    }

    public readonly profileTickets$ = this._ticketService.profileTickets$;

    public async ngOnInit() {
        forkJoin([
            await this.getProfileTicketsAsync()
        ]).subscribe();
    };

    /**
    * Функция получает тикеты пользователя.
    * @returns - Список тикетов.
    */
    private async getProfileTicketsAsync() {
        (await this._ticketService.getProfileTicketsAsync())
            .subscribe(_ => {
                console.log("Тикеты ЛК: ", this.profileTickets$.value);
            });
    };
}