import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { forkJoin } from "rxjs";
import { TicketService } from "../services/ticket.service";

@Component({
    selector: "ticket",
    templateUrl: "./ticket.component.html",
    styleUrls: ["./ticket.component.scss"]
})

/**
 * Класс компонента тикетов.
 */
export class TicketComponent implements OnInit {
    constructor(private readonly _ticketService: TicketService) {
    }

    public readonly ticketCategories$ = this._ticketService.ticketCategories$; 
    selectedCategory: any;
    ticketMessage: string = "";

    public async ngOnInit() {
        forkJoin([          
           await this.getTicketCategoriesAsync()
        ]).subscribe();
    };

     /**
    * Функция получает список базы резюме.
    * @returns - Список базы резюме.
    */
      private async getTicketCategoriesAsync() {    
        (await this._ticketService.getTicketCategoriesAsync())
        .subscribe(_ => {
            console.log("Категории тикетов: ", this.ticketCategories$.value);
        });
    };
}