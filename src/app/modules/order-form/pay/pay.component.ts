import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { forkJoin } from "rxjs";
import { PaymentOrderInput } from "../models/payment-order-input";
import { OrderService } from "../services/order.service";

@Component({
    selector: "pay",
    templateUrl: "./pay.component.html",
    styleUrls: ["./pay.component.scss"]
})

/**
 * Класс компонента ФЗ (оплата).
 */
export class PayComponent implements OnInit {
    constructor(private readonly _router: Router,
        private readonly _activatedRoute: ActivatedRoute,
        private readonly _orderService: OrderService) {
    } 

    public readonly orderPay$ = this._orderService.orderPay$;    

    publicId: string = "";

    public async ngOnInit() {
        forkJoin([
           this.checkUrlParams()
        ]).subscribe();
    };

    private async checkUrlParams() {
        this._activatedRoute.queryParams
        .subscribe(async params => {
            this.publicId = params["publicId"];    
          });
    };

    public onRouteNextStep() {
        this._router.navigate(["/order-form/complete"], {
            queryParams: {
                publicId: this.publicId,
                step: 5
            }
        });
    };

    /**
     * Функция оплачивает заказ.
     * @param paymentOrderInput - Входная модель.
     * @returns - Данные заказа.
    */
    public async onPayOrderAsync() {
        let paymentOrderInput = new PaymentOrderInput();
        paymentOrderInput.publicId = this.publicId;

        (await this._orderService.payOrderAsync(paymentOrderInput))
        .subscribe(_ => {
            console.log("Оплатили заказ: ", this.orderPay$.value);

            if (this.orderPay$.value.url !== ""
                && this.orderPay$.value.url !== null) {
                window.location.href = this.orderPay$.value.url;
            }
        });
    };
}