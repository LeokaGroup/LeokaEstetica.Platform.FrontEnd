import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { forkJoin } from "rxjs";
import { BackOfficeService } from "../../../services/backoffice.service";

@Component({
    selector: "order-details",
    templateUrl: "./order-details.component.html",
    styleUrls: ["./order-details.component.scss"]
})

/**
 * Класс компонента деталей заказа.
 */
export class OrderDetailsComponent implements OnInit {
    public readonly userOrders$ = this._backofficeService.userOrders$;
    public readonly orderDetails$ = this._backofficeService.orderDetails$;

    constructor(private readonly _backofficeService: BackOfficeService,
        private readonly _activatedRoute: ActivatedRoute) {
    }

    order: any;
    orderId: number = 0;
    orderName: string = "";
    orderDetails: string = "";
    price: number = 0;
    statusName: string = "";

    public async ngOnInit() {
        forkJoin([           
           this.checkUrlParams()
        ]).subscribe();
    };

    private checkUrlParams() {
        this._activatedRoute.queryParams
        .subscribe(async params => {
            console.log("params: ", params);
            this.orderId = +params["orderId"];
            await this.getOrderDetailsAsync();
          });
    };

    /**
     * Функция получает детали заказа по его Id.
     * @returns - Детали заказа.
     */
    private async getOrderDetailsAsync() {
        (await this._backofficeService.getOrderDetailsAsync(this.orderId))
            .subscribe(_ => {
                console.log("Детали заказа: ", this.orderDetails$.value);
                this.orderName = this.orderDetails$.value.orderName;
                this.orderDetails = this.orderDetails$.value.orderDetails;
                this.price = this.orderDetails$.value.price;
                this.statusName = this.orderDetails$.value.statusName;
            });
    };
}