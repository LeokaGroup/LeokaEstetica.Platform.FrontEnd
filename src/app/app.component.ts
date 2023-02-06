import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NavigationStart, Router, Event as NavigationEvent, ActivatedRoute } from "@angular/router";
import { NetworkService } from './core/interceptors/network.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public loading$ = this.networkService.loading$;
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

  constructor(public networkService: NetworkService,
    private readonly _router: Router,
    private readonly _activatedRoute: ActivatedRoute,
    private changeDetectorRef: ChangeDetectorRef) { }

  public ngOnInit() {
    this.checkCurrentRouteUrl();
  };

  public rerender(): void {
    console.log("reload");
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

    // Отображение левого меню профиля пользователя.
    if (this._aVisibleProfileMenuRoutes.includes(currentUrl)) {      
      this.isVisibleMenu = true;
      localStorage["m_t"] = 1;
    }

    if (this._aVisibleVacancyMenuRoutes.includes(currentUrl)) {
      localStorage["m_t"] = 2;
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

    if (currentUrl.indexOf("moderation") > 0 
    || currentUrl.indexOf("administration") > 0) {
      this.rerender();
      this.isVisibleMenu = false;
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
      });
  };
}
