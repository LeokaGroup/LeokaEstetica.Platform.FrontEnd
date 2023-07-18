import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
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
        private readonly _router: Router) {
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
        let wisheOfferInput = new WisheOfferInput();
        wisheOfferInput.contactEmail = this.contactEmail;
        wisheOfferInput.wisheOfferText = this.wisheOfferText;

        (await this._ticketService.createWisheOfferAsync(wisheOfferInput))
            .subscribe((response: any) => {
                if (response) {
                    console.log("onCreateWisheOfferAsync ok");
                }
            });
    };
}