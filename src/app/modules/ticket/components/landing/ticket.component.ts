import { Component, OnInit } from "@angular/core";
import { MessageService } from "primeng/api";
import { forkJoin } from "rxjs";
import { CreateTicketInput } from "../../models/input/create-ticket-input";
import { TicketService } from "../../services/ticket.service";

@Component({
    selector: "ticket",
    templateUrl: "./ticket.component.html",
    styleUrls: ["./ticket.component.scss"]
})

/**
 * Класс компонента тикетов.
 */
export class TicketComponent implements OnInit {
    constructor(private readonly _ticketService: TicketService,
        private readonly _messageService: MessageService) {
    }

    public readonly ticketCategories$ = this._ticketService.ticketCategories$;
    selectedCategory: any;
    ticketMessage: string = "";
    isAvailableTicket: boolean = false;

    public async ngOnInit() {
        forkJoin([
            await this.getTicketCategoriesAsync()
        ]).subscribe();

        if (localStorage["t_n"]) {
            this.isAvailableTicket = true;
        }
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

    /**
  * Функция создает тикет.
  */
    public async onCreateTicketAsync() {
        let ticketInput = new CreateTicketInput();
        ticketInput.title = this.selectedCategory.categoryName;
        ticketInput.message = this.ticketMessage;

        (await this._ticketService.createTicketAsync(ticketInput))
            .subscribe((response: any) => {
                console.log("Создан тикет: ", this.ticketCategories$.value);

                if (response) {
                    this._messageService.add({ severity: 'success', summary: "Все хорошо", detail: "Обращение успешно создано. Ответы на него Вы можете отслеживать в личном кабинете." });
                    this.ticketMessage = "";
                }
            });
    };
}