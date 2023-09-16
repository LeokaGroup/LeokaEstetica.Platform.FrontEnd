import { Component, OnInit } from "@angular/core";
import { forkJoin } from "rxjs";
import { PressService } from "../services/press.service";

@Component({
    selector: "contact",
    templateUrl: "./contact.component.html",
    styleUrls: ["./contact.component.scss"]
})

/**
 * Класс компонента контактов.
 */
export class ContactComponent implements OnInit {
    constructor(private readonly _pressService: PressService) {
    }

    public readonly contacts$ = this._pressService.contacts$;

    public async ngOnInit() {
        forkJoin([
            await this.getSelectedCallCenterTicketsAsync()
        ]).subscribe();
    };

    /**
    * Функция получает контакты.
    * @returns - Список контактов.
    */
    private async getSelectedCallCenterTicketsAsync() {
        (await this._pressService.getContactsAsync())
            .subscribe(_ => {
                console.log("Контакты: ", this.contacts$.value);
            });
    };
}