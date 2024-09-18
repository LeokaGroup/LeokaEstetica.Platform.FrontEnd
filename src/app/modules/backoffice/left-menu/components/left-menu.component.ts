import { Component, OnInit } from "@angular/core";
import {ActivatedRoute, Event as NavigationEvent, NavigationStart, Router} from "@angular/router";
import { RedirectService } from "src/app/common/services/redirect.service";
import { BackOfficeService } from "../../services/backoffice.service";

interface ProfileItem {
    url: string;
    [key: string]: any;
  }

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

    menuItems: any[] = [];

    aNotificationsSysNames: string[] = [
        "Notifications"
    ];

    archivedProjectsSysNames: string = "ArchiveProjects";
    archivedVacanciesSysNames: string = "ArchiveVacancies";
    profileMessages: string = "Messages"
    isShowLeftMenuConditional: boolean = true;

  constructor(private readonly _backOfficeService: BackOfficeService,
              private readonly _router: Router,
              private readonly _redirectService: RedirectService,
              private readonly _activatedRoute: ActivatedRoute) {
  }

    public async ngOnInit() {
      this.checkUrlParams();
        if (localStorage["m_t"] == "1") {
            await this.getProfileInfoAsync();
        }

        if (localStorage["m_t"] == "2") {
            await this.getVacancyInfoAsync();
        }
    };

  private checkUrlParams() {
    this._router.events
      .subscribe(
        (event: any) => {
          if (event.url.includes("/user/signin") || event.url.includes("/user/signup")) {
            debugger;
            this.isShowLeftMenuConditional = false;
          }

          else {
            this.isShowLeftMenuConditional = true;
          }
        });
  };

    /**
     * Функция получает пункты меню профиля пользователя.
     * @returns Список меню.
     */
    private async getProfileInfoAsync() {
        (await this._backOfficeService.getProfileItemsAsync())
            .subscribe(_ => {
                console.log("Меню профиля: ", this.profileItems$.value);
                this.menuItems = this.profileItems$.value.profileMenuItems.map(({url, ...rest}: ProfileItem) => rest );
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
                this.menuItems = this.vacancyItems$.value.vacancyMenuItems.map(({url, ...rest}: ProfileItem) => rest );
            });
    };

    /**
    * Функция распределяет по роутам.
    * @param event - Событие.
    */
    public async onSelectMenu(event: any) {
        console.log("event", event);
        let text = event.target.textContent;
        event.preventDefault();

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
                    // this._router.navigate(["/profile/projects/create"]).then(() => {
                    //     this._redirectService.redirect("profile/projects/create");
                    // });
                }

                // Роут на страницу создания вакансии.
                if (this.aCreateVacanciesSysName.includes(this.sysName)) {
                    this._router.navigate(["/vacancies/create"]);
                  // this._router.navigate(["/vacancies/create"]).then(() => {
                  //   this._redirectService.redirect("/vacancies/create");
                  // });
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

                // Роут на страницу архива проектов пользователя.
                if (this.archivedProjectsSysNames == this.sysName) {
                    this._router.navigate(["/projects/archive"]);
                }

                // Роут на страницу архива вакансий пользователя.
                if (this.archivedVacanciesSysNames == this.sysName) {
                    this._router.navigate(["/vacancies/archive"]);
                }

                // Роут на страницу сообщений ЛК пользователя.
                if (this.profileMessages == this.sysName) {
                    this._router.navigate(["/profile/messages"]);
                }
            });
    };
}
