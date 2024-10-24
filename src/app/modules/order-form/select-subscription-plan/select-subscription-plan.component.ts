import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {forkJoin} from "rxjs";
import {CreateOrderCacheInput} from "../models/create-order-cache-input";
import {OrderService} from "../services/order.service";

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
  public readonly freePrice$ = this._orderService.freePrice$;
  public readonly calculatedPrice$ = this._orderService.calculatedPrice$;

  publicId: string = "";
  isContinue: boolean = false;
  employeeCount: number = 1;
  aMonthItems: any[] = [
    {name: '1', key: '1'},
    {name: '3', key: '3'},
    {name: '6', key: '6'},
    {name: '12', key: '12'}
  ];
  selectedMonth: any;
  isRoutePayment: boolean = false;
  isCompleteUserAction: boolean = false;

  public async ngOnInit() {
    forkJoin([
      this.checkUrlParams()
    ]).subscribe();
  };

  public async onRouteNextStepAsync() {
    // TODO: Вернем этот этап, когда внедрим услуги, сервисы в нову юсистему оплат.
    // this._router.navigate(["/order-form/products"], {
    //   queryParams: {
    //     publicId: this.publicId,
    //     step: 3
    //   }
    // });

    await this.createOrderAsync().then(_ => {
      this._router.navigate(["/order-form/pay"], {
        queryParams: {
          publicId: this.publicId,
          step: 3
        }
      });
    });
  };

  private async checkUrlParams() {
    this._activatedRoute.queryParams
      .subscribe(async params => {
        this.publicId = params["publicId"];
      });
  };

  /**
   * Функция создает заказ.
   */
  private async createOrderAsync() {
    if (+this.selectedMonth?.key > 0 && this.employeeCount > 0) {
      let createOrderCacheInput = new CreateOrderCacheInput();
      createOrderCacheInput.publicId = this.publicId;
      createOrderCacheInput.paymentMonth = +this.selectedMonth?.key;
      createOrderCacheInput.employeesCount = +this.employeeCount;
      createOrderCacheInput.OrderType = "FareRule";

      (await this._orderService.createOrderAsync(createOrderCacheInput))
        .subscribe(async _ => {
          console.log("Заказ: ", this.calculatedPrice$.value);
        });
    }
  };

  /**
   * Функция вычисляет цену заказа и отображает пользователю.
   */
  public async onCalculatePriceAsync() {
    if (+this.selectedMonth?.key > 0 && this.employeeCount > 0) {
      (await this._orderService.calculateFareRulePriceAsync(this.publicId, +this.selectedMonth.key, this.employeeCount))
        .subscribe(async _ => {
          console.log("Вычисленная цена: ", this.calculatedPrice$.value);
          this.isContinue = true;
        });
    }
  };
}
