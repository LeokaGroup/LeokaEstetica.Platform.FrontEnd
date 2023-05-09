import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { forkJoin } from "rxjs";

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
        private readonly _activatedRoute: ActivatedRoute) {
    }   

    paymentMonth: number = 0;

    public async ngOnInit() {
        forkJoin([
           
        ]).subscribe();
    };
}