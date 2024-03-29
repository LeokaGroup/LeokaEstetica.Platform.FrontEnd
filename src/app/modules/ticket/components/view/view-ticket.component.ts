import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { forkJoin } from "rxjs";
import { CloseTicketInput } from "../../models/input/close-ticket-input";
import { CreateTicketMessageInput } from "../../models/input/create-ticket-message-input";
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
    public readonly ticketMessages$ = this._ticketService.ticketMessages$;
    public readonly closedTicket$ = this._ticketService.closedTicket$;    

    ticketId: number = 0;
    ticketMessage: string = "";
    aMessages: any[] = [];
    selectedTicketName: string = "";
    isCloseTicket: boolean = false;

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
                console.log("Выбранный тикет: ", this.selectedTicket$.value);
                this.aMessages = this.selectedTicket$.value.messages;
                this.selectedTicketName = this.selectedTicket$.value.ticketName;
            });
    };

    /**
    * Функция создает сообщение тикета.
    * @param createTicketMessageInput - Входная модель.
    * @returns - Список сообщений тикета.
    */
     public async onCreateTicketMessageAsync() {
        let createTicketMessageInput = new CreateTicketMessageInput();
        createTicketMessageInput.ticketId = this.ticketId;
        createTicketMessageInput.message = this.ticketMessage;

        (await this._ticketService.createTicketMessageAsync(createTicketMessageInput))
            .subscribe(async _ => {
                console.log("Сообщения тикета: ", this.ticketMessages$.value);
                this.ticketMessage = "";
                this.aMessages = this.ticketMessages$.value.messages;
            });
    };

     /**
    * Функция закрывает тикет.
    */
    public async onCloseTicketAsyic() {
        let closeTicketInput = new CloseTicketInput();
        closeTicketInput.ticketId = this.ticketId;

        (await this._ticketService.closeTicketAsync(closeTicketInput))
            .subscribe(_ => {
                console.log("Закрыли тикет: ", this.closedTicket$.value);
            });
    };
}