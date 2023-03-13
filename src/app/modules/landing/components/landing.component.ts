import { Component, OnInit } from "@angular/core";
import { PrimeIcons } from "primeng/api";
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
    public readonly timelines$ = this._landingService.timelines$;    

    // events: any[] = [
    //     {status: 'Ordered'},
    //     {status: 'Processing'},
    //     {status: 'Shipped'},
    //     {status: 'Delivered'}
    // ];

    aCreateProject: any[] = [];
    aSearchProject: any[] = [];
    aCreateVacancy: any[] = [];
    aSearchVacancy: any[] = [];
    aSearchTeam: any[] = [];    

    constructor(private readonly _landingService: LandingService) {
    }

    public async ngOnInit() {
        forkJoin([
            await this.getFonLandingStartAsync(),
            await this.getPlatformOffersAsync(),
            await this.getTimelinesAsync()
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

    /**
     * Функция получает список таймлайнов.
     * @returns - Список таймлайнов.
     */
     private async getTimelinesAsync() {
        (await this._landingService.getTimelinesAsync())
        .subscribe(_ => {
            console.log("Список таймлайнов: ", this.timelines$.value);
            this.fillTimelines();            
        });
    };

    private fillTimelines(): void {
        let timelines = this.timelines$.value;
        this.aSearchProject = timelines.SearchProject;
        this.aCreateProject = timelines.CreateProject;
        this.aSearchVacancy = timelines.SearchVacancy;
        this.aCreateVacancy = timelines.CreateVacancy;
        this.aSearchTeam = timelines.SearchTeam;
    }
}