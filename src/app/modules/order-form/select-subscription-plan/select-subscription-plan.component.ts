import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { forkJoin } from "rxjs";
import { CreateOrderCacheInput } from "../models/create-order-cache-input";
import { OrderService } from "../services/order.service";

@Component({
    selector: "select-subscription-plan",
    templateUrl: "./select-subscription-plan.component.html",
    styleUrls: ["./select-subscription-plan.component.scss"]
})

/**
 * Класс компонента ФЗ (выбор тарифного плана).
 */
export class OrderFormSelectSubscriptionPlanComponent implements OnInit {
    constructor(private readonly _router: Router,
        private readonly _activatedRoute: ActivatedRoute,
        private readonly _orderService: OrderService) {
    }   

    public readonly orderForm$ = this._orderService.orderForm$;    

    paymentMonth: number = 0;
    publicId: string = "";
    orderCacheInput: CreateOrderCacheInput = new CreateOrderCacheInput();
    orderForm: any = {};
    disableDiscount: boolean = false;

    public async ngOnInit() {
        forkJoin([
           this.checkUrlParams()
        ]).subscribe();
    };

    public onRouteNextStep() {
        this._router.navigate(["/order-form/products"], {
            queryParams: {
                publicId: this.publicId,
                step: 3
            }
        });
    };

    private async checkUrlParams() {
        this._activatedRoute.queryParams
        .subscribe(async params => {
            this.publicId = params["publicId"];
          });
    };

    public async onChangePaymentMonth() {
        this.orderCacheInput.publicId = this.publicId;
        this.orderCacheInput.paymentMonth = this.paymentMonth;
        console.log("CreateOrderCacheInput", this.orderCacheInput);        
    };

    public async onCreateOrderCacheAsync() {
        (await this._orderService.createOrderCacheAsync(this.orderCacheInput))
        .subscribe(_ => {
            console.log("Заказ в кэше: ", this.orderForm$.value);
            this.orderForm = this.orderForm$.value;

            if (this.paymentMonth == 1) {
                this.disableDiscount = true;
            }

            else {
                this.disableDiscount = false;
            }
        });
    };
}