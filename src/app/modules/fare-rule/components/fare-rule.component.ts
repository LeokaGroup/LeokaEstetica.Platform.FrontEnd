import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { forkJoin } from "rxjs";
import { FareRuleService } from "../services/fare-rule.service";

@Component({
    selector: "fare-rules",
    templateUrl: "./fare-rule.component.html",
    styleUrls: ["./fare-rule.component.scss"]
})

/**
 * Класс компонента списка тарифа.
 */
export class FareRuleComponent implements OnInit {
    constructor(private readonly _router: Router,
        private readonly _fareRuleService: FareRuleService) {
    }

    public readonly fareRules$ = this._fareRuleService.fareRules$;

    responsiveOptions: any;
    numVisible: number = 3;
    numScroll: number = 3;
    carouselType: "horizontal" | "vertical" = "horizontal";
    isAvailableFareRule: boolean = false;
    aFareRuleAttributeNames: any[] = [];

    public async ngOnInit() {
        forkJoin([
           await this.getFareRulesAsync()
        ]).subscribe();

        // Планшеты.
        // if (window.matchMedia('screen and (min-width: 600px) and (max-width: 992px)').matches) {
        //     this.numVisible = 1;
        //     this.numScroll = 1;
        //     this.carouselType = "vertical";
        // }
        //
        // if (localStorage["t_n"]) {
        //     this.isAvailableFareRule = true;
        // }
    };

     /**
     * Функция получает прафила тарифов.
     * @returns - Прафила тарифов.
     */
     private async getFareRulesAsync() {
       (await this._fareRuleService.getFareRulesAsync())
         .subscribe(_ => {
           console.log("Правила тарифов: ", this.fareRules$.value);

           // Заполняем названия атрибутов тарифов.
           this.fareRules$.value.forEach((fareRules: any) => {
             fareRules.fareRuleAttributes.forEach((attr: any) => {
               if (this.aFareRuleAttributeNames.filter(x => x.attributeId == attr.attributeId).length == 0) {
                 this.aFareRuleAttributeNames.push(attr);
               }
             });
           });
         });
     };

    /**
     * Функция переходит на ФЗ.
     * @param publicId - Публмичный ключ тарифа.
     */
    public async onRouteOrderInfoAsync(publicId: string) {
        this._router.navigate(["/order-form/info"], {
            queryParams: {
                publicId,
                step: 1
            }
        });
    };
}
