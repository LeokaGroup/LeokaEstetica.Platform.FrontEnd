import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { forkJoin } from "rxjs";
import { CreateOrderInput } from "../../pay/models/create-order-input";
import { PaymentService } from "../../pay/services/pay.service";
import { FareRuleService } from "../services/fare-rule.service";

@Component({
    selector: "fare-rule",
    templateUrl: "./fare-rule.component.html",
    styleUrls: ["./fare-rule.component.scss"]
})

/**
 * Класс каталога проектов.
 */
export class FareRuleComponent implements OnInit {
    constructor(private readonly _router: Router,
        private readonly _activatedRoute: ActivatedRoute,
        private readonly _fareRuleService: FareRuleService,
        private readonly _paymentService: PaymentService) {
    }

    public readonly fareRules$ = this._fareRuleService.fareRules$;  
    public readonly createOrder$ = this._paymentService.createOrder$;       

    public async ngOnInit() {
        forkJoin([
           await this.getFareRulesAsync()
        ]).subscribe();
    };   

     /**
     * Функция получает прафила тарифов.
     * @returns - Прафила тарифов.
     */
      private async getFareRulesAsync() {    
        (await this._fareRuleService.getFareRulesAsync())
        .subscribe(_ => {
            console.log("Правила тарифов: ", this.fareRules$.value);
        });
    };

    /**
     * Функция создает заказ.
     * @returns - Данные заказа.
     */
     public async onCreateOrderAsync(fareRuleId: number) {
        let createOrderInput = new CreateOrderInput();
        createOrderInput.FareRuleId = fareRuleId;

        (await this._paymentService.createOrderAsync(createOrderInput))
        .subscribe((response: any) => {
            console.log("Данные платежа: ", this.createOrder$.value);
            if (+response.paymentId > 0) {
                window.location.href = response.url;
            }   
        });
    };
}