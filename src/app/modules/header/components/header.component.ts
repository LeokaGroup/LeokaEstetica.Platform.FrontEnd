import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
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

    isHideAuthButtons: boolean = false;

    constructor(private readonly _headerService: HeaderService,
        private readonly _router: Router,
        private readonly _activatedRoute: ActivatedRoute) {
    }

    public async ngOnInit() {
        await this.getHeaderItemsAsync();
        await this._headerService.refreshTokenAsync();
        this.checkUrlParams();
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
     * Функция редиректит на форму регистрации.
     */
    public onRouteSignUp() {
        this._router.navigate(["/user/signup"]);
    };

    /**
     * Функция редиректит на форму авторизации.
     */
    public onRouteSignIn() {
        this._router.navigate(["/user/signin"]);
    };

    public onSelectHeaderItem(e: any) {
        console.log(e.menuItemUrl);
        this._router.navigate([e.menuItemUrl]);
    };

    private checkUrlParams() {
        this._activatedRoute.queryParams
        .subscribe(params => {
            let mode = params["mode"];

            if (!mode || mode == "view") {
                this.isHideAuthButtons = true;
            }          
          });
    };

    /**
     * Функция переходит в профиль пользователя.
     */
    public onRouteProfile() {
        this._router.navigate(["/profile/aboutme"], {
            queryParams: {
                mode: "view"
            }
        });
    };
}