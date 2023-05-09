import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { forkJoin } from "rxjs";

@Component({
    selector: "products",
    templateUrl: "./products.component.html",
    styleUrls: ["./products.component.scss"]
})

/**
 * Класс компонента ФЗ (продукты и сервисы).
 */
export class OrderFormProductsComponent implements OnInit {
    constructor(private readonly _router: Router,
        private readonly _activatedRoute: ActivatedRoute) {
    } 

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
          });
    };

    public onRouteNextStep() {
        this._router.navigate(["/order-form/subscription-plan"], {
            queryParams: {
                publicId: this.publicId,
                step: 4
            }
        });
    };
}