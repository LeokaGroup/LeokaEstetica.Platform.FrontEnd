import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { BackOfficeService } from "../../services/backoffice.service";

@Component({
    selector: "left-menu",
    templateUrl: "./left-menu.component.html",
    styleUrls: ["./left-menu.component.scss"]
})

/**
 * Класс компонента левого меню.
 */
export class LeftMenuComponent implements OnInit {
    public readonly profileItems$ = this._backOfficeService.profileItems$;
    public readonly vacancyItems$ = this._backOfficeService.vacancyItems$;
    public readonly selectMenu$ = this._backOfficeService.selectMenu$;

    sysName: string = "";
    isFindSysName: boolean = false;
    aProfileMenuLine: any[] = [];
    aViewSysNames: string[] = [
        "ViewWorksheet"
    ];
    aEditSysNames: string[] = [
        "EditWorksheet"
    ];
    aProjectsSysName: string[] = [
        "MyProjectsList"
    ];
    aCreateProjectsSysName: string[] = [
        "CreateProject"
    ];
    aCreateVacanciesSysName: string[] = [
        "CreateVacancy"
    ];
    aVacanciesSysName: string[] = [
        "MyVacanciesList"
    ];
    aSubscriptionsSysNames: string[] = [
        "Subscriptions"
    ];

    manuItems: any[] = [];

    aNotificationsSysNames: string[] = [
        "Notifications"
    ];

    constructor(private readonly _backOfficeService: BackOfficeService,
        private readonly _router: Router) {
    }

    public async ngOnInit() {
        if (localStorage["m_t"] == "1") {
            await this.getProfileInfoAsync();
        }

        if (localStorage["m_t"] == "2") {
            await this.getVacancyInfoAsync();
        }
    };

    /**
     * Функция получает пункты меню профиля пользователя.
     * @returns Список меню.
     */
    private async getProfileInfoAsync() {
        (await this._backOfficeService.getProfileItemsAsync())
        .subscribe(_ => {
            console.log("Меню профиля: ", this.profileItems$.value);
            this.manuItems = this.profileItems$.value.profileMenuItems;
        });
    };

    /**
     * Функция получает пункты меню вакансий.
     * @returns Список меню.
     */
     private async getVacancyInfoAsync() {
        (await this._backOfficeService.getVacancyItemsAsync())
        .subscribe(_ => {
            console.log("Меню вакансий: ", this.vacancyItems$.value);
            this.manuItems = this.vacancyItems$.value.vacancyMenuItems;
        });
    };

     /**
     * Функция распределяет по роутам.
     * @param event - Событие.
     */
    public async onSelectMenu(event: any) {
        console.log("event", event);
        let text = event.target.textContent;

        (await this._backOfficeService.selectProfileMenuAsync(text))
        .subscribe(_ => {
            console.log("Выбрали меню: ", this.selectMenu$.value.sysName);
            this.sysName = this.selectMenu$.value.sysName;

            // Роут на просмотр анкеты.
            if (this.aViewSysNames.includes(this.sysName)) {
                this._router.navigate(["/profile/aboutme"], {
                    queryParams: {
                        mode: "view"
                    }
                });
            }

            // Роут на изменение анкеты.
            if (this.aEditSysNames.includes(this.sysName)) {
                this._router.navigate(["/profile/aboutme"], {
                    queryParams: {
                        mode: "edit"
                    }
                });
            }

            // Роут на страницу мои проекты.
            if (this.aProjectsSysName.includes(this.sysName)) {
                this._router.navigate(["/profile/projects/my"]);
            }

            // Роут на страницу создания проекта.
            if (this.aCreateProjectsSysName.includes(this.sysName)) {
                this._router.navigate(["/profile/projects/create"]);
            }

            // Роут на страницу создания вакансии.
            if (this.aCreateVacanciesSysName.includes(this.sysName)) {
                this._router.navigate(["/vacancies/create"]);
            }

            // Роут на страницу списка вакансии.
            if (this.aVacanciesSysName.includes(this.sysName)) {
              this._router.navigate(["/vacancies/my"]);
            }


            // Роут на страницу создания вакансии.подписок
            if (this.aSubscriptionsSysNames.includes(this.sysName)) {
                this._router.navigate(["/subscriptions"]);
            }

            // Роут на страницу уведомлений пользователя.
            if (this.aNotificationsSysNames.includes(this.sysName)) {
                this._router.navigate(["/notifications"]);
            }
        });
    };
}
