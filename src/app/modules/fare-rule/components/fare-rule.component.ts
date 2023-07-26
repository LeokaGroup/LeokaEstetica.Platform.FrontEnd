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
