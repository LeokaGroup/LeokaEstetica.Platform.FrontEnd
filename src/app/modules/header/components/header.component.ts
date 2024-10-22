import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { HeaderService } from "../services/header.service";
import {ProjectManagmentService} from "../../project-managment/services/project-managment.service";
import { filter } from "rxjs";

@Component({
    selector: "header",
    templateUrl: "./header.component.html",
    styleUrls: ["./header.component.scss"]
})

/**
 * Класс компонента хидера (верхнее меню).
 */
export class HeaderComponent implements OnInit {
    public readonly headerData$ = this._headerService.headerData$;
    public readonly projectWorkspaceSettings$ = this._projectManagmentService.projectWorkspaceSettings$;
    public readonly headerLandingData$ = this._headerService.headerLandingData$;

    isHideAuthButtons: boolean = false;
    currentUrl = '';
    isShowLandingMenu: boolean = false;

  menu: any[] = [];

  constructor(private readonly _headerService: HeaderService,
              private readonly _router: Router,
              private readonly _activatedRoute: ActivatedRoute,
              private readonly _projectManagmentService: ProjectManagmentService) {
  }

  public async ngOnInit() {
    await this.checkUrlParams();
    await this._headerService.refreshTokenAsync();

    this.isHideAuthButtons = localStorage["t_n"] ? true : false;
  };

    /**
     * Функция получит список элементов хидера.
     * @returns - Список элементов хидера.
     */
    private async getHeaderItemsAsync() {
        (await this._headerService.getHeaderItemsAsync())
        .subscribe(_ => {
            console.log("Данные хидера: ", this.headerData$.value);

            // Навешиваем команды для каждого пункта меню.
            this.menu = this.headerData$.value.items.map((item: any) => {
              // Навешиваем команды 1 уровню.
              item.command = (event: any) => {
                switch (event.item.id) {
                  case "Calendar":
                    this._router.navigate(["/calendar"]);
                    break;

                  case "Chat":
                    this._router.navigate(["/chat"]);
                    break;
                }
              }

              // Навешиваем команды уровню профиля.
              if (item.id == "Profile") {
                // Смотрим вложенность профиля.
                item.items.forEach((p: any) => {
                  p.command = async (event: any) => {
                    switch (event.item.id) {
                      case "Orders":
                        this._router.navigate(["/profile/orders"]);
                        break;

                      case "Tickets":
                        this._router.navigate(["/profile/tickets"]);
                        break;

                      case "Exit":
                        localStorage.clear();
                        this._router.navigate(["/user/signin"]);
                        await this.checkUrlParams();
                        break;
                    }
                  };
                });
              }
              return item;
            });
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

  public async onSelectHeaderItem(e: any) {
    console.log(e.menuItemUrl);
    await this.getBuildProjectSpaceSettingsAsync(e.menuItemUrl);
  };

  private async checkUrlParams() {
    this._router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(async e => {
      this.currentUrl = (e as NavigationEnd).url;

      if (!this.currentUrl.includes("/user/signin")
        && !this.currentUrl.includes("/user/signup")
        && !!localStorage["t_n"]) {
        await this.getHeaderItemsAsync();
      }

      this.isShowLandingMenu = this.currentUrl == "/";
    });

    this._activatedRoute.queryParams
      .subscribe(_ => {
        this.rerenderAuthButtons();
      });

    await this.getLandingMenuItemsAsync();
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

  /**
   * Функция меняет флаг показа: кнопки регистрации || аватар-меню.
   */
  private rerenderAuthButtons() {
    this.isHideAuthButtons = localStorage["t_n"] ? true : false;
  };

  // TODO: Дублируется.
  private async getBuildProjectSpaceSettingsAsync(menuItemUrl: any) {
    if (menuItemUrl == "/project-management/workspaces") {
      (await this._projectManagmentService.getBuildProjectSpaceSettingsAsync(null, null))
        .subscribe(_ => {
          console.log("projectWorkspaceSettings", this.projectWorkspaceSettings$.value);

          // Редирект в общее пространство.
          if (this.projectWorkspaceSettings$.value.isDefaultSpaceUrl) {
            this._router.navigate(["/project-management/workspaces"]);
          }

          else {
            window.location.href = this.projectWorkspaceSettings$.value.projectManagmentSpaceUrl;
          }
        });
    }

    else {
      this._router.navigate([menuItemUrl]);
    }
  };

  /**
   * Функция получает элементы меню для всех Landing страниц.
   * В будущем можно унифицировать этот эндпоинт будет под разные меню разных Landing страниц.
   * @returns - Элементы Landing меню.
   */
  private async getLandingMenuItemsAsync() {
    (await this._headerService.getLandingMenuItemsAsync())
      .subscribe(_ => {
        console.log("Данные хидера лендоса: ", this.headerLandingData$);

        // Навешиваем команды для каждого пункта меню.
        this.headerLandingData$.value.items.forEach((item: any) => {
          // Навешиваем команды 1 уровню тарифов.
          if (item.id == "FareRules") {
            item.command = (event: any) => {
              switch (event.item.id) {
                case "FareRules":
                  this._router.navigate(["/fare-rules"]);
                  break;
              }
            }
          }

          // Навешиваем команды уровню решений.
          if (item.id == "Solutions") {
            // Смотрим вложенность профиля.
            // item.items.forEach((p: any) => {
            //   p.command = (event: any) => {
            //     switch (event.item.id) {
            //       case "Orders":
            //         this._router.navigate(["/profile/orders"]);
            //         break;
            //
            //       case "Tickets":
            //         this._router.navigate(["/profile/tickets"]);
            //         break;
            //
            //       case "Exit":
            //         localStorage.clear();
            //
            //         // TODO: В идеале отрефачить без этого.
            //         // Нужно, чтобы избежать бага с рендером хидера (оставался верхний хидер при логауте).
            //         window.location.href = window.location.href + "/user/signin";
            //         break;
            //     }
            //   };
            // });
          }
        });
      });
  };
}
