import { Component, OnInit } from "@angular/core";
import { forkJoin } from "rxjs";
import { BackOfficeService } from "../../services/backoffice.service";

@Component({
    selector: "orders",
    templateUrl: "./orders.component.html",
    styleUrls: ["./orders.component.scss"]
})

/**
 * Класс компонента заказов пользователя.
 */
export class OrdersComponent implements OnInit {
    public readonly userOrders$ = this._backofficeService.userOrders$;

    constructor(private readonly _backofficeService: BackOfficeService) {
    }

    selectedOrder: any;

    public async ngOnInit() {
        forkJoin([
           await this.getUserOrdersAsync()
        ]).subscribe();
    };

    /**
     * Функция получает список заказов пользователя.
     * @returns - Список заказов пользователя.
     */
    private async getUserOrdersAsync() {
        (await this._backofficeService.getUserOrdersAsync())
            .subscribe(_ => {
                console.log("Заказы пользователя: ", this.userOrders$.value);
            });
    };
}