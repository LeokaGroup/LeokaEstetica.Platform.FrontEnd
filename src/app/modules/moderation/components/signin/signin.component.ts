import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { HeaderService } from "src/app/modules/header/services/header.service";
import { AccessModerationInput } from "../../models/input/access-moderation-input";
import { CallCenterService } from "../../services/callcenter.service";

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
    public readonly accessModeration$ = this._callCenterService.accessModeration$;

    isHideAuthButtons: boolean = false;

    formAccessModeration: FormGroup = new FormGroup({
        "emailModeration": new FormControl("", [
            Validators.required,
            Validators.email
        ]),

        "passwordModeration": new FormControl("", [
            Validators.required,
            Validators.pattern(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&^_-]).{8,}/)
        ])
    });

    constructor(private readonly _headerService: HeaderService,
        private readonly _callCenterService: CallCenterService,
        private readonly _router: Router) {
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

    /**
     * Функция првоеряет доступ пользователя к модерации.
     * @returns - Признак доступа к модерации.
     */
    public async onCheckAvailableUserRoleModerationAsync() {
        let accessModerationInput = new AccessModerationInput();
        accessModerationInput.Email = this.formAccessModeration.value.emailModeration;

        (await this._callCenterService.checkAvailableUserRoleModerationAsync(accessModerationInput))
        .subscribe((response: any) => {
            console.log("Проверка роли модерации: ", this.accessModeration$.value);

            if (response.accessModeration) {
                this._router.navigate(["/callcenter"]);
            }
        });
    };
}