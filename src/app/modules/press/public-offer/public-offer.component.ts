import { Component, OnInit } from "@angular/core";
import { forkJoin } from "rxjs";
import { PressService } from "../services/press.service";

@Component({
    selector: "public-offer",
    templateUrl: "./public-offer.component.html",
    styleUrls: ["./public-offer.component.scss"]
})

/**
 * Класс компонента публичной оферты.
 */
export class PublicOfferComponent implements OnInit {
    constructor(private readonly _pressService: PressService) {
    }

    public readonly publicOffer$ = this._pressService.publicOffer$;

    public async ngOnInit() {
        forkJoin([
            await this.getPublicOfferAsync()
        ]).subscribe();
    };

    /**
    * Функция получает данные публичной оферты.
    * @returns - Данные публичной оферты.
    */
    private async getPublicOfferAsync() {
        (await this._pressService.getPublicOfferAsync())
            .subscribe(_ => {
                console.log("Публичная оферта: ", this.publicOffer$.value);
            });
    };
}