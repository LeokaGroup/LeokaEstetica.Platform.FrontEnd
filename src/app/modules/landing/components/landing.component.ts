import { Component, OnInit } from "@angular/core";
import { forkJoin } from "rxjs";
import { LandingService } from "../services/landing.service";

@Component({
    selector: "landing",
    templateUrl: "./landing.component.html",
    styleUrls: ["./landing.component.scss"]
})

/**
 * Класс календаря пользователя.
 */
export class LandingComponent implements OnInit {
    public readonly fonData$ = this._landingService.fonData$;
    public readonly platformOffers$ = this._landingService.platformOffers$;    

    constructor(private readonly _landingService: LandingService) {
    }

    public async ngOnInit() {
        forkJoin([
            await this.getFonLandingStartAsync(),
            await this.getPlatformOffersAsync()
        ]).subscribe();        
    };

    /**
     * Функция получает данные фона главного лендинга.
     * @returns - Данные фона.
     */
    private async getFonLandingStartAsync() {
        (await this._landingService.getFonLandingStartAsync())
        .subscribe(_ => {
            console.log("Данные фона лендинга: ", this.fonData$.value);
        });
    };

    /**
     * Функция получает данные предложений платформы.
     * @returns - Данные предложений платформы.
     */
    private async getPlatformOffersAsync() {
        (await this._landingService.getPlatformOffersAsync())
        .subscribe(_ => {
            console.log("Список предложений платформы: ", this.platformOffers$.value);
        });
    };
}