import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { forkJoin } from "rxjs";
import { OrderFormService } from "../services/order-form.service";

@Component({
    selector: "order-form-info",
    templateUrl: "./order-form-info.component.html",
    styleUrls: ["./order-form-info.component.scss"]
})

/**
 * Класс компонента ФЗ (информация о тарифе).
 */
export class OrderFormInfoComponent implements OnInit {
    constructor(private readonly _router: Router,
        private readonly _activatedRoute: ActivatedRoute,
        private readonly _orderFormService: OrderFormService) {
    }

    public readonly fareRuleInfo$ = this._orderFormService.fareRuleInfo$;    

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
            await this.getFareRuleInfoAsync();      
          });
    };

    private async getFareRuleInfoAsync() {
        (await this._orderFormService.getFareRuleInfoAsync(this.publicId))
        .subscribe(_ => {
            console.log("Информация о тарифе: ", this.fareRuleInfo$.value);
        });
    };

    public onRouteNextStep() {
        this._router.navigate(["/order-form/subscription-plan"], {
            queryParams: {
                publicId: this.publicId,
                step: 2
            }
        });
    };
}