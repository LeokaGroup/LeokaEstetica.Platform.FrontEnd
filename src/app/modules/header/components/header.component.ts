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

    isHideAuthButtons: boolean = false;
    currentUrl = '';
    items: any[] = [
        {
            label: 'Заказы',
            command: () => {
                this._router.navigate(["/profile/orders"]);
            }
        },
        // {
        //     label: 'Настройки',
        //     command: () => {

        //     }
        // },
        {
            label: 'Заявки в поддержку',
            command: () => {
                this._router.navigate(["/profile/tickets"])
            }
        },
        {
            label: 'Выйти',
            command: () => {
                localStorage.clear();
                this._router.navigate(["/user/signin"]);
            }
        }
    ];

  constructor(private readonly _headerService: HeaderService,
              private readonly _router: Router,
              private readonly _activatedRoute: ActivatedRoute,
              // TODO: remove - ?
              // private readonly _redirectService: RedirectService,
              // private changeDetectorRef: ChangeDetectorRef,
              private readonly _projectManagmentService: ProjectManagmentService) {
  }

  public async ngOnInit() {
    await this.getHeaderItemsAsync();
    await this._headerService.refreshTokenAsync();
    this.checkUrlParams();

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
            this.headerData$.value.items.forEach((item: any) => {
              item.command = (event: any) => {
                switch (event.item.id) {
                  case "Calendar":
                    this._router.navigate(["/calendar/employee"]);
                    break;

                  case "Orders":
                    this._router.navigate(["/profile/orders"]);
                    break;

                  case "Tickets":
                    this._router.navigate(["/profile/tickets"]);
                    break;

                  case "Exit":
                    localStorage.clear();
                    this._router.navigate(["/user/signin"]);
                    break;
                }
              }
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
    // this._router.navigate([e.menuItemUrl]);
    await this.getBuildProjectSpaceSettingsAsync(e.menuItemUrl);
  };

    private checkUrlParams() {
        this._router.events.pipe(
            filter(event => event instanceof NavigationEnd)
        ).subscribe(
            e => this.currentUrl = (e as NavigationEnd).url
        );

        this._activatedRoute.queryParams
        .subscribe(_ => {
            this.rerenderAuthButtons();
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

  /**
   * Функция меняет флаг показа: кнопки регистрации || аватар-меню.
   */
  private rerenderAuthButtons() {
    this.isHideAuthButtons = localStorage["t_n"] ? true : false;
    // TODO: remove - ?
    // this.changeDetectorRef.markForCheck();
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
}
