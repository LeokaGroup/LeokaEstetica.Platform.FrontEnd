import { Component, OnInit } from '@angular/core';
import { NavigationStart, Router, Event as NavigationEvent } from "@angular/router";
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
    "/projects/project?projectId"
  ];

  private _aVisibleVacancyMenuRoutes: string[] = [
    "/vacancies",
    "/vacancies/create"
  ];

  private projectModeUrls = [
    "/projects/project?projectId",
    "/projects"
  ];

  constructor(public networkService: NetworkService,
    private _router: Router) { }

    public ngOnInit() {
      this.checkCurrentRouteUrl();      
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
            }
          });
    };

    /**
     * Функция проверяет видимости контролов в зависимости от роутов.
     * @param currentUrl - Текущий роут.
     */
    private checkRoutes(currentUrl: string) {
      // Отображение левого меню профиля пользователя.
      if (this._aVisibleProfileMenuRoutes.includes(currentUrl)) {
        this.isVisibleMenu = true;
        localStorage["m_t"] = 1;
      }

      if (this._aVisibleVacancyMenuRoutes.includes(currentUrl)) {
        localStorage["m_t"] = 2;
        this.isVisibleMenu = true;
      }

      if (this.projectModeUrls.includes(currentUrl)) {
        this.isVisibleMenu = true;
        localStorage["m_t"] = 1;
      }
    };
}
