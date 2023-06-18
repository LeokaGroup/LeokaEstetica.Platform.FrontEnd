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

  paymentMonth: number = 0;
  publicId: string = "";
  orderCacheInput: CreateOrderCacheInput = new CreateOrderCacheInput();
  orderForm: any = {};
  disableDiscount: boolean = false;
  freePrice: number = 0;
  isContinueCreateOrderCache: boolean = false;
  isShowNeedContinueModal: boolean = false;
  isSuccessLimits: boolean = false;
  reductionSubscriptionLimits: string = "";
  fareLimitsCount: number = 0;
  isShowSuccessLimitsModal: boolean = false;
  reductionSubscriptionLimitsType: string = "";
  isContinue: boolean = false;

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

  /**
   * Функция создает заказ в кэше.
   */
  public async onCreateOrderCacheAsync() {
    this.isContinue = false;

    if (this.paymentMonth > 0) {
      await this.calculateFreePriceAsync();
    }
  };

  /**
   * Функция вычисляет остаток с текущей активной подписки пользователя.
   * @returns - Сумма остатка, если она есть.
   */
  private async calculateFreePriceAsync() {
    (await this._orderService.calculateFreePriceAsync(this.publicId, this.paymentMonth))
      .subscribe(async _ => {
        console.log("Сумма остатка: ", this.freePrice$.value);
        this.freePrice = this.freePrice$.value.freePrice;

        // Отображаем модалку апрува с новой ценой от пользователя.
        this.isShowNeedContinueModal = this.freePrice$.value.price !== this.freePrice$.value.freePrice
          && !this.isContinueCreateOrderCache;

        // Если пользователь дал согласие с новой ценой либо модалку не показывали и тогда оформляем как обычно.
        if (this.isContinueCreateOrderCache
          || !this.isShowNeedContinueModal) {
          (await this._orderService.createOrderCacheAsync(this.orderCacheInput))
            .subscribe(async _ => {
              console.log("Заказ в кэше: ", this.orderForm$.value);
              this.orderForm = this.orderForm$.value;
              this.disableDiscount = this.paymentMonth == 1;
              this.isSuccessLimits = this.orderForm$.value.isSuccessLimits;
              this.isShowSuccessLimitsModal = !this.isSuccessLimits;

              if (!this.isSuccessLimits) {
                this.isContinue = false;
              }

              else {
                this.isContinue = true;
              }

              this.fareLimitsCount = this.orderForm$.value.fareLimitsCount;

              if (this.orderForm$.value.reductionSubscriptionLimits == "Project") {
                this.reductionSubscriptionLimits = "Количество проектов превышающих лимит: ";
                this.reductionSubscriptionLimitsType = "проекты";
              }

              else {
                this.reductionSubscriptionLimits = "Количество вакансий превышающих лимит: ";
                this.reductionSubscriptionLimitsType = "вакансии";
              }              
            });
        }
      });
  };

  /**
   * Функция апрува с новой ценой.
   */
  public async onApproveCalculatedPriceAsync() {
    this.isContinueCreateOrderCache = true;
    this.isShowNeedContinueModal = false;
    await this.calculateFreePriceAsync();
  };
}
