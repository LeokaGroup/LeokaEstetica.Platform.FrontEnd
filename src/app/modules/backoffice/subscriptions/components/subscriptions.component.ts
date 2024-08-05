import { Component, OnInit } from "@angular/core";
import { forkJoin } from "rxjs";
import { CreateRefundInput } from "../../vacancy/models/input/create-refund-input";
import { SubscriptionsService } from "../services/subscriptions.service";

@Component({
    selector: "subscriptions",
    templateUrl: "./subscriptions.component.html",
    styleUrls: ["./subscriptions.component.scss"]
})

/**
 * Класс компонента подписок пользователя.
 */
export class SubscriptionsComponent implements OnInit {
    constructor(private readonly _subscriptionsService: SubscriptionsService) { }

    public readonly subscriptions$ = this._subscriptionsService.subscriptions$;  
    public readonly refund$ = this._subscriptionsService.refund$;  
    public readonly fareRuleInfo$ = this._subscriptionsService.fareRuleInfo$;    
    public readonly createdRefund$ = this._subscriptionsService.createdRefund$;    

    refundPrice: number = 0;
    isRefund: boolean = false;
    allFeedSubscription: any;
    isFareRuleDetails: boolean = false;
    fareRuleInfo: any = {};
    orderId: number = 0;

    public async ngOnInit() {
        forkJoin([
           await this.getSubscriptionsAsync()
        ]).subscribe();
    };   

     /**
     * Функция получает прафила тарифов.
     * @returns - Прафила тарифов.
     */
      private async getSubscriptionsAsync() {    
        (await this._subscriptionsService.getSubscriptionsAsync())
        .subscribe(_ => {
            console.log("Список подписок: ", this.subscriptions$.value);
        });
    };

    /**
     * Функция вычисляет сумму возврата.
     * @returns - Данные возврата.
     */
     public async onCalculateRefundAsync() {    
        (await this._subscriptionsService.calculateRefundAsync())
        .subscribe(_ => {
            console.log("Вычисление возврата: ", this.refund$.value);
            this.refundPrice = this.refund$.value.price;
            this.orderId = this.refund$.value.orderId;
            this.isRefund = true;
        });
    };

    /**
     * 
     * Функция создает возврат.
     * @returns - Данные возврата.
     */
    public async onRefundAsync() {
        let refundInput = new CreateRefundInput();
        refundInput.OrderId = this.orderId;
        refundInput.Price = this.refundPrice;

        (await this._subscriptionsService.createRefundAsync(refundInput))
        .subscribe(_ => {
            console.log("Создали возврат: ", this.createdRefund$.value);
        });
    };

    /**
     * Функция получает детали тарифа.
     * @param objectId - Id тарифа.
     */
    public async onShowFareRuleDetailsAsync(objectId: number) {
        (await this._subscriptionsService.getFareRuleDetailsAsync(objectId))
        .subscribe(_ => {
            console.log("Информация о тарифе: ", this.fareRuleInfo$.value);
            this.fareRuleInfo = this.fareRuleInfo$.value;
            this.isFareRuleDetails = true;
        });
    };
}