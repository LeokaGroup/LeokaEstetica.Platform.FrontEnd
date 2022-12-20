import { Component, OnInit } from "@angular/core";
import { HeaderService } from "src/app/modules/header/services/header.service";

@Component({
    selector: "signin",
    templateUrl: "./signin.component.html",
    styleUrls: ["./signin.component.scss"]
})

/**
 * Класс компонента входа модерации.
 */
export class SignInComponent implements OnInit {
    public readonly headerData$ = this._headerService.headerData$;

    isHideAuthButtons: boolean = false;

    constructor(private readonly _headerService: HeaderService) {
    }

    public async ngOnInit() {
        await this.getHeaderItemsAsync();
        await this._headerService.refreshTokenAsync();
    }

    /**
     * Функция получит список элементов хидера.
     * @returns - Список элементов хидера.
     */
    private async getHeaderItemsAsync() {
        (await this._headerService.getHeaderItemsAsync())
        .subscribe(_ => {
            console.log("Данные хидера: ", this.headerData$.value);
        });
    };
}