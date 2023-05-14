import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { forkJoin } from "rxjs";
import { OrderService } from "../services/order.service";

@Component({
    selector: "products",
    templateUrl: "./products.component.html",
    styleUrls: ["./products.component.scss"]
})

/**
 * Класс компонента ФЗ (продукты и сервисы).
 */
export class OrderFormProductsComponent implements OnInit {
    constructor(private readonly _router: Router,
        private readonly _activatedRoute: ActivatedRoute,
        private readonly _orderService: OrderService) {
    } 

    public readonly orderProducts$ = this._orderService.orderProducts$;    

    publicId: string = "";
    orderForm: any = {};
    paymentMonth: number = 0;
    disableDiscount: boolean = false;

    public async ngOnInit() {
        forkJoin([
           this.checkUrlParams(),
           await this.getOrderProductsCacheAsync()
        ]).subscribe();
    };

    private async checkUrlParams() {
        this._activatedRoute.queryParams
        .subscribe(async params => {
            this.publicId = params["publicId"];    
          });
    };

    public onRouteNextStep() {
        this._router.navigate(["/order-form/subscription-plan"], {
            queryParams: {
                publicId: this.publicId,
                step: 4
            }
        });
    };

    private async getOrderProductsCacheAsync() {
        (await this._orderService.getOrderProductsCacheAsync(this.publicId))
        .subscribe(_ => {
            console.log("Услуги и сервисы: ", this.orderProducts$.value);
            this.orderForm = this.orderProducts$.value;

            if (this.orderForm.month == 1) {
                this.disableDiscount = true;
            }

            else {
                this.disableDiscount = false;
            }
        });
    };
}