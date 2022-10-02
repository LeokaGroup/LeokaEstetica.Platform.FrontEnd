import { Component, OnInit } from "@angular/core";
import { HeaderService } from "../services/header.service";

@Component({
    selector: "header",
    templateUrl: "./header.component.html",
    styleUrls: ["./header.component.scss"]
})

/**
 * Класс календаря пользователя.
 */
export class HeaderComponent implements OnInit {
    public readonly headerData$ = this._headerService.headerData$;

    constructor(private readonly _headerService: HeaderService) {
    }

    public async ngOnInit() {
        await this.getHeaderItemsAsync();
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