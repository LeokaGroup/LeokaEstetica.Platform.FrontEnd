import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {forkJoin} from "rxjs";
import {OrderFormService} from "../order-form-info/services/order-form.service";

@Component({
  selector: "order-form-steps",
  templateUrl: "./order-form-steps.component.html",
  styleUrls: ["./order-form-steps.component.scss"]
})

/**
 * Класс компонента ФЗ (список этапов).
 */
export class OrderFormStepsComponent implements OnInit {
  constructor(private readonly _router: Router,
              private readonly _activatedRoute: ActivatedRoute,
              private readonly _orderFormService: OrderFormService) {
  }

  public readonly fareRuleInfo$ = this._orderFormService.fareRuleInfo$;

  publicId: string = "";
  selectedStep: number = 0;
  items: any[] = [
    {
      label: "Выбранный тарифный план"
    },
    {
      label: "Настройки тарифного плана"
    },
    // TODO: Заложим позже - это будет.
    // {
    //     label: "Услуги и сервисы"
    // },
    {
      label: "Оплата тарифного плана"
    }
  ];

  public async ngOnInit() {
    forkJoin([
      this.checkUrlParams()
    ]).subscribe();
  };

  private async checkUrlParams() {
    this._activatedRoute.queryParams
      .subscribe(async params => {
        this.publicId = params["publicId"];
        this.selectedStep = params["step"] - 1; // Вычитаем 1, потому что стипсы считаются от 0.
      });
  };

  public onActiveStepIndexChange(event: any) {

  };
}
