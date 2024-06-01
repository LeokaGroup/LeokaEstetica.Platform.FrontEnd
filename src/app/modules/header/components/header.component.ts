import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { RedirectService } from "src/app/common/services/redirect.service";
import { HeaderService } from "../services/header.service";
import {ProjectManagmentService} from "../../project-managment/services/project-managment.service";

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
                this._router.navigate(["/user/signin"]).then(() => {
                    this._redirectService.redirect("user/signin");
                });
            }
        }
    ];

  constructor(private readonly _headerService: HeaderService,
              private readonly _router: Router,
              private readonly _activatedRoute: ActivatedRoute,
              private readonly _redirectService: RedirectService,
              private changeDetectorRef: ChangeDetectorRef,
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
        this._router.navigate(["/user/signin"]).then(() => {
            this._redirectService.redirect("user/signin");
        });
    };

  public async onSelectHeaderItem(e: any) {
    console.log(e.menuItemUrl);
    // this._router.navigate([e.menuItemUrl]);
    await this.getBuildProjectSpaceSettingsAsync(e.menuItemUrl);
  };

    private checkUrlParams() {
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

    private rerenderAuthButtons() {
        this.isHideAuthButtons = false;
        this.changeDetectorRef.detectChanges();
        this.isHideAuthButtons = true;
    };

  // TODO: Дублируется.
  private async getBuildProjectSpaceSettingsAsync(menuItemUrl: any) {
    if (menuItemUrl == "/project-management/workspaces") {
      (await this._projectManagmentService.getBuildProjectSpaceSettingsAsync())
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
