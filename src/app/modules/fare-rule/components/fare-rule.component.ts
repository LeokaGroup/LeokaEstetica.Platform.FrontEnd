import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { forkJoin } from "rxjs";
import { FareRuleService } from "../services/fare-rule.service";

@Component({
    selector: "fare-rule",
    templateUrl: "./fare-rule.component.html",
    styleUrls: ["./fare-rule.component.scss"]
})

/**
 * Класс компонента правил тарифа.
 */
export class FareRuleComponent implements OnInit {    
    constructor(private readonly _router: Router,
        private readonly _fareRuleService: FareRuleService) {
    }

    public readonly fareRules$ = this._fareRuleService.fareRules$;

    responsiveOptions: any;
    numVisible: number = 3;
    numScroll: number = 3;
    carouselType: string = "";
    isAvailableFareRule: boolean = false;

    public async ngOnInit() {
        forkJoin([
           await this.getFareRulesAsync()
        ]).subscribe();

        // Планшеты.
        if (window.matchMedia('screen and (min-width: 600px) and (max-width: 992px)').matches) {
            this.numVisible = 1;
            this.numScroll = 1;
            this.carouselType = "vertical";
        }

        if (localStorage["t_n"]) {
            this.isAvailableFareRule = true;
        }
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
