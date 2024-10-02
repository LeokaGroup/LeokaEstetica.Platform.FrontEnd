import { Component, OnInit } from "@angular/core";
import {Router} from "@angular/router";
import { RedirectService } from "src/app/common/services/redirect.service";
import { BackOfficeService } from "../../services/backoffice.service";
import {ProjectManagmentService} from "../../../project-managment/services/project-managment.service";
import {CompanyInput} from "../../../project-managment/models/input/company-input";

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
    public readonly userCompanies$ = this._projectManagmentService.userCompanies$;

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

    aNotificationsSysNames: string[] = [
        "Notifications"
    ];

    archivedProjectsSysNames: string = "ArchiveProjects";
    archivedVacanciesSysNames: string = "ArchiveVacancies";
    profileMessages: string = "Messages"
    isShowLeftMenuConditional: boolean = true;
    isCreateCompany: boolean = false;
    isSelectCompany: boolean = false;
    aUserCompanies: any[] = [];
    selectedCompany: any;
    companyName: string = "";

  constructor(private readonly _backOfficeService: BackOfficeService,
              private readonly _router: Router,
              private readonly _redirectService: RedirectService,
              private readonly _projectManagmentService: ProjectManagmentService) {
  }

    public async ngOnInit() {
      this.checkUrlParams();
      await this.getLeftMenuItemsAsync();
    };

  private checkUrlParams() {
    this._router.events
      .subscribe(
        (event: any) => {
          if (event.url.includes("/user/signin") || event.url.includes("/user/signup")) {
            this.isShowLeftMenuConditional = false;
          }

          else {
            this.isShowLeftMenuConditional = true;
          }
        });
  };

  /**
   * Функция получает элементы левого меню.
   * @returns Список элементов меню.
   */
  private async getLeftMenuItemsAsync() {
    (await this._backOfficeService.getLeftMenuItemsAsync())
      .subscribe(_ => {
        console.log("Левое меню: ", this.profileItems$.value);

        // Навешиваем команды для каждого пункта меню.
        this.profileItems$.value.items.forEach((item: any) => {
          item.command = (event: any) => {
            switch (event.item.id) {
              case "ViewProfile":
                this._router.navigate(["/profile/aboutme"], {
                  queryParams: {
                    mode: "view"
                  }
                });
                break;

              case "EditProfile":
                this._router.navigate(["/profile/aboutme"], {
                  queryParams: {
                    mode: "edit"
                  }
                });
                break;

              case "WorkSpaces":
                this._router.navigate(["/project-management/workspaces"]);
                break;

              // TODO: Добавить параметр projectId.
              case "Wiki":
                this._router.navigate(["/project-management/wiki"], {
                  queryParams: {
                    projectId: 0
                  }
                });
                break;

              // TODO: Добавить параметр projectId.
              case "Tasks":
                this._router.navigate(["/project-management/space"], {
                  queryParams: {
                    projectId: 0
                  }
                });
                break;

              // TODO: Добавить параметр projectId.
              case "Backlog":
                this._router.navigate(["/project-management/space/backlog"], {
                  queryParams: {
                    projectId: 0
                  }
                });
                break;

              // TODO: Добавить параметр projectId.
              case "Sprints":
                this._router.navigate(["/project-management/sprints"], {
                  queryParams: {
                    projectId: 0
                  }
                });
                break;

              // TODO: Пока не реализовано.
              case "Roadmaps":
                break;

              // TODO: Пока не реализовано.
              case "Reports":
                break;

              // TODO: Пока не реализовано.
              case "Dashboards":
                break;

              // TODO: Пока не реализовано.
              case "Timesheets":
                break;

              // TODO: Пока не реализовано.
              case "Releases":
                break;

              case "CreateVacancy":
                this._router.navigate(["/vacancies/create"]);
                break;

              case "UserVacancies":
                this._router.navigate(["/vacancies/my"]);
                break;

              case "ArchivedVacancies":
                this._router.navigate(["/vacancies/archive"]);
                break;
            }
          }
        });
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
            .subscribe(async (_: any) => {
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
                  // Сначала вычисляем кол-во компаний пользователя.
                  (await this._projectManagmentService.calculateUserCompanyAsync())
                    // Если требуется действие от пользователя.
                    .subscribe(async (response: any) => {
                      if (response.isNeedUserAction) {
                        // Если компаний 0 - то требуем создать сначала компанию.
                        // Показываем соответствующую модалку.
                        if (!response.ifExistsAnyCompanies && !response.ifExistsMultiCompanies) {
                          this.isCreateCompany = true;
                        }

                        // Если более 1, то требуем выбрать, к какой компании отнести проект.
                        // Показываем соответствующую модалку.
                        else if (response.ifExistsMultiCompanies && !response.ifExistsAnyCompanies) {
                          this.isSelectCompany = true;

                          (await this._projectManagmentService.getUserCompaniesAsync())
                            .subscribe((_: any) => {
                              this.aUserCompanies = this.userCompanies$.value;
                            });
                        }
                      }

                      else {
                        this._router.navigate(["/profile/projects/create"]);
                      }
                    });
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

              // Переход на страницу календаря.
              if (this.sysName == "Calendar") {
                this._router.navigate(["/calendar/employee"]);
              }
            });
    };

    public onRouteCreateProject() {
      let companyId = this.selectedCompany.companyId;

      this._router.navigate(["/profile/projects/create"], {
        queryParams: {
          companyId
        }
      });
    };

  /**
   * Функция создает компанию в кэше.
   */
  public async onCreateCompanyAsync() {
    if (!this.companyName) {
      return;
    }
    let companyInput = new CompanyInput();
    companyInput.companyName = this.companyName;

    (await this._projectManagmentService.createCompanyCacheAsync(companyInput))
      .subscribe((_: any) => {
        this._router.navigate(["/profile/projects/create"]);
      });
  };
}
