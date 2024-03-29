import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { forkJoin } from "rxjs";
import { BackOfficeService } from "../../../services/backoffice.service";

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
    public readonly histories$ = this._backofficeService.histories$;

    constructor(private readonly _backofficeService: BackOfficeService,
        private readonly _router: Router) {
    }

    selectedOrder: any;

    public async ngOnInit() {
        forkJoin([
           await this.getUserOrdersAsync(),
           await this.getHistoriesAsync()
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

    /**
     * Функция переходит на страницу деталей заказа.
     * @param orderId - Id заказа.
     */
    public onRouteViewOrder(orderId: number) {
        this._router.navigate(["/profile/orders/details"], {
            queryParams: {
                orderId
            }
        });
    };

    /**
     * Функция получает список транзакций по заказам пользователя.
     * @returns - Список транзакций.
     */
     private async getHistoriesAsync() {
        (await this._backofficeService.getHistoriesAsync())
            .subscribe(_ => {
                console.log("Транзакции пользователя: ", this.histories$.value);
            });
    };
}