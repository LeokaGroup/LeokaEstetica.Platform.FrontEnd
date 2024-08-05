import {AfterViewInit, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { NavigationStart, Router, Event as NavigationEvent, ActivatedRoute } from "@angular/router";
import { NetworkService } from './core/interceptors/network.service';
import {API_URL} from "./core/core-urls/api-urls";
import {HttpTransportType, HubConnectionBuilder} from "@microsoft/signalr";
import {RedisService} from "./modules/redis/services/redis.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {
  public loading$ = this.networkService.loading$;
  public readonly checkUserCode$ = this._redisService.checkUserCode$;


  public isVisibleMenu: boolean = false;
  private _aVisibleProfileMenuRoutes: string[] = [
    "/profile/aboutme?mode=view",
    "/profile/aboutme?mode=edit",
    "/profile/projects/my",
    "/profile/projects/create",
    "/vacancies",
    "/projects/project?projectId",
    "/subscriptions"
  ];

  private _aVisibleVacancyMenuRoutes: string[] = [
    "/vacancies",
    "/vacancies/create"
  ];

  private projectModeUrls = [
    "/projects/project?projectId",
    "/projects"
  ];

  private resumeModeUrls = [
    "/resumes"
  ];
  counter: number = 0;
  currentUrl: string = "";
  isVisibleHeader: boolean = false;
  isVisibleProjectManagementMenu: boolean = false;
  hubConnection: any;

  constructor(public networkService: NetworkService,
              private readonly _router: Router,
              private readonly _activatedRoute: ActivatedRoute,
              private changeDetectorRef: ChangeDetectorRef,
              private readonly _redisService: RedisService) {

  }

  public async ngOnInit() {
    this.checkCurrentRouteUrl();
    this.isVisibleHeader = true;
  };

  public async ngAfterViewInit() {
    if (this.currentUrl != "user/signin") {
      let module;

      if (this.currentUrl.includes("project-management")) {
        module = "ProjectManagement";
      }

      else {
        module = "Main";
      }

      if (!module || !localStorage["u_c"]) {
        return;
      }

      (await this._redisService.checkConnectionIdCacheAsync(localStorage["u_c"], module))
        .subscribe((response: any) => {

          // В кэше нету, создаем новое подключение пользователя и кладем в кэш.
          if (localStorage["u_c"] && !response.isCacheExists) {
            let notifyRoute = module == "Main" ? "notify" : "project-management-notify";

            this.hubConnection = new HubConnectionBuilder()
              .withUrl(API_URL.apiUrl + `/${notifyRoute}?userCode=${localStorage["u_c"]}&module=${module}`, HttpTransportType.LongPolling)
              .build();

            if (this.hubConnection.state != "Connected" && this.hubConnection.connectionId == null) {
              this.hubConnection.start().then(async () => {
                console.log("Соединение установлено");
                console.log("ConnectionId:", this.hubConnection.connectionId);
              })
                .catch((err: any) => {
                  console.error(err);
                });
            }
          }
        });
    }
  }

  public rerender(): void {
    this.isVisibleMenu = false;
    this.changeDetectorRef.detectChanges();
    this.isVisibleMenu = true;
};

  /**
   * Функция проверяет текущий роут.
   */
  private checkCurrentRouteUrl() {
    this._router.events
      .subscribe(
        (event: NavigationEvent) => {
          if (event instanceof NavigationStart) {
            console.log(event.url);
            this.checkRoutes(event.url);

            if (this.currentUrl == "/") {
              this.isVisibleMenu = false;
            }

            if (this.currentUrl == "/forbidden") {
              this.isVisibleMenu = false;
            }
          }
        });
  };

  /**
   * Функция проверяет видимости контролов в зависимости от роутов.
   * @param currentUrl - Текущий роут.
   */
  private checkRoutes(currentUrl: string) {
    this.currentUrl = currentUrl;
    this.rerender();

    if (currentUrl == "forbidden") {
      this.isVisibleMenu = false;
    }

    // Отображение левого меню профиля пользователя.
    if (this._aVisibleProfileMenuRoutes.includes(currentUrl)) {
      this.isVisibleMenu = true;
      localStorage["m_t"] = 1;
    }

    if (this._aVisibleVacancyMenuRoutes.includes(currentUrl)) {
      localStorage["m_t"] = 1;
      this.isVisibleMenu = true;
    }

    if (this.projectModeUrls.includes(currentUrl)
    || this.resumeModeUrls.includes(currentUrl)) {
      this.isVisibleMenu = true;
      localStorage["m_t"] = 1;
    }

    if (currentUrl.indexOf("projectId") > 0) {
      this.rerender();
      this.isVisibleMenu = true;
    }

    if (currentUrl.indexOf("user/signin") >= 0) {
      this.rerender();
      this.isVisibleMenu = false;
    }

    if (currentUrl.indexOf("profile/aboutme?mode=view") >= 0) {
      this.rerender();
    }

    if (currentUrl.indexOf("/") >= 0) {
      this.rerender();
    }

    if (currentUrl.indexOf("callcenter") >= 0) {
      this.isVisibleMenu = false;
    }

    if (currentUrl.indexOf("press/offer") >= 0) {
      this.isVisibleMenu = false;
    }

    if (currentUrl.indexOf("project-management") >= 0) {
      this.isVisibleProjectManagementMenu = true;
      this.isVisibleMenu = false;
    }

    if (currentUrl === "/") {
      this.isVisibleProjectManagementMenu = false;
    }

    this._activatedRoute.queryParams
      .subscribe(params => {
        // Для просмотра анкеты другого пользователя.
        if (params["uc"] !== null && params["uc"] !== undefined) {
          this.isVisibleMenu = true;
        }

        // Для просмотра проекта.
        if (params["projectId"] > 0 && params["mode"] == "view") {
          this.isVisibleMenu = true;
        }

        if (params["page"]) {
          this.isVisibleMenu = true;
        }

        if (currentUrl.indexOf("fare-rules") >= 0) {
          this.isVisibleMenu = false;
        }
      });
  };
}
