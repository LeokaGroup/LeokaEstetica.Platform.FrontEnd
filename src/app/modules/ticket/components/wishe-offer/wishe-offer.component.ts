import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { MessageService } from "primeng/api";
import { forkJoin } from "rxjs";
import { WisheOfferInput } from "../../models/input/wishe-offer-input";
import { TicketService } from "../../services/ticket.service";

@Component({
    selector: "wishe-offer",
    templateUrl: "./wishe-offer.component.html",
    styleUrls: ["./wishe-offer.component.scss"]
})

/**
 * Класс компонента предложение/пожеланий.
 */
export class WisheOfferComponent implements OnInit {
    constructor(private readonly _ticketService: TicketService,
        private readonly _router: Router,
        private readonly _messageService: MessageService) {
    }

    public readonly profileTickets$ = this._ticketService.profileTickets$;

    contactEmail: string = "";
    wisheOfferText: string = "";

    public async ngOnInit() {
        forkJoin([
            
        ]).subscribe();
    };

    /**
    * Функция получает тикеты пользователя.
    * @returns - Список тикетов.
    */
    public async onCreateWisheOfferAsync() {
        if (this.contactEmail == "" || this.wisheOfferText == "") {
            this._messageService.add({ severity: 'warn', summary: "Внимание", detail: "Не все обязательные поля заполнены." });

            return;
        }

        let wisheOfferInput = new WisheOfferInput();
        wisheOfferInput.contactEmail = this.contactEmail;
        wisheOfferInput.wisheOfferText = this.wisheOfferText;

        (await this._ticketService.createWisheOfferAsync(wisheOfferInput))
            .subscribe((response: any) => {
                if (response) {
                    if (response.errors !== null && response.errors.length > 0) {
                        response.errors.forEach((item: any) => {
                            this._messageService.add({ severity: 'error', summary: "Что то не так", detail: item.errorMessage });
                        });
                    }

                    else {
                        this._messageService.add({ severity: 'success', summary: "Все хорошо", detail: "Обращение успешно создано. Ответы на него Вы можете отслеживать в личном кабинете." });
                    }

                    this.contactEmail = "";
                    this.wisheOfferText = "";
                };
            });
    };
}