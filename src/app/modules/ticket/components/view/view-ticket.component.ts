import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { forkJoin } from "rxjs";
import { TicketService } from "../../services/ticket.service";

@Component({
    selector: "view-ticket",
    templateUrl: "./view-ticket.component.html",
    styleUrls: ["./view-ticket.component.scss"]
})

/**
 * Класс компонента просмотра тикета.
 */
export class ViewTicketComponent implements OnInit {
    constructor(private readonly _ticketService: TicketService,
        private readonly _activatedRoute: ActivatedRoute) {
    }

    public readonly profileTickets$ = this._ticketService.profileTickets$;
    public readonly selectedTicket$ = this._ticketService.selectedTicket$;

    ticketId: number = 0;
    message: string = "";
    ticketMessage: string = "";

    public async ngOnInit() {
        forkJoin([
            this.checkUrlParams()
        ]).subscribe();
    };

    private checkUrlParams() {
        this._activatedRoute.queryParams
        .subscribe(async params => {
            this.ticketId = params["ticketId"];      
            await this.getSelectedCallCenterTicketsAsync(this.ticketId);              
          });
    };

    /**
    * Функция получает тикеты пользователя.
    * @returns - Список тикетов.
    */
    private async getSelectedCallCenterTicketsAsync(ticketId: number) {
        (await this._ticketService.getSelectedCallCenterTicketsAsync(ticketId))
            .subscribe(_ => {
                console.log("Тикеты ЛК: ", this.selectedTicket$.value);
            });
    };
}