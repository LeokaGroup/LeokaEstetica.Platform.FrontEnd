import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
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

    formSignUp: FormGroup = new FormGroup({
        "email": new FormControl("", [
            Validators.required,
            Validators.email
        ]),

        "password": new FormControl("", [
            Validators.required,
            Validators.pattern(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&^_-]).{8,}/)
        ])
    });

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