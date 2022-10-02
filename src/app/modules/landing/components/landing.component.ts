import { Component, OnInit } from "@angular/core";
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

    constructor(private readonly _landingService: LandingService) {
    }

    public async ngOnInit() {
        await this.getFonLandingStartAsync();
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
}