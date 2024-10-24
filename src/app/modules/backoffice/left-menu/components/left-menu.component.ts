import { Component, OnInit } from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import { BackOfficeService } from "../../services/backoffice.service";
import {ProjectManagmentService} from "../../../project-managment/services/project-managment.service";
import {CompanyInput} from "../../../project-managment/models/input/company-input";

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
    isExistsProjectId: boolean = false;
    projectId?: number;
  isShowInviteBlock: boolean = true;

  constructor(private readonly _backOfficeService: BackOfficeService,
              private readonly _router: Router,
              private readonly _projectManagmentService: ProjectManagmentService,
              private readonly _activatedRoute: ActivatedRoute) {
  }

  public readonly projectWorkspaceSettings$ = this._projectManagmentService.projectWorkspaceSettings$;

    public async ngOnInit() {
      await this.checkUrlParams();
      await this.getLeftMenuItemsAsync();
    };

  private async checkUrlParams() {
    this._router.events
      .subscribe(async (event: any) => {
        if (!event.url.includes("/aboutme")) {
          this.isShowInviteBlock = false;
        }

        else {
          this.isShowInviteBlock = true;
        }
      });
  };

  /**
   * Функция получает элементы левого меню.
   * @returns Список элементов меню.
   */
  private async getLeftMenuItemsAsync() {
    (await this._backOfficeService.getLeftMenuItemsAsync())
      .subscribe(async _ => {
        console.log("Левое меню: ", this.profileItems$.value);

        let isDisableProjectManagementModule: boolean = false;

        // Действия, которые зависят от параметров в url.
        this._activatedRoute.queryParams.subscribe(async params => {
          this.projectId = params['projectId'];

          // Дизейблим пункты модуля УП, если не были зафиксированы настройки проекта.
          if (this._router.url.includes("/project-management/start") && Number(this.projectId) > 0) {
            (await this._projectManagmentService.getBuildProjectSpaceSettingsAsync(Number(this.projectId), null))
              .subscribe(_ => {
                console.log("projectWorkspaceSettings", this.projectWorkspaceSettings$.value);

                isDisableProjectManagementModule = !this.projectWorkspaceSettings$.value.isCommitProjectSettings;
              });
          }
        });

        let projectId: number = Number(this.projectId);

        // Навешиваем команды для каждого пункта меню.
        this.profileItems$.value.items.forEach((item: any) => {
          // Команды первого уровня.
          item.command = (event: any) => {
            switch (event.item.id) {
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

          // Мое пространство.
          if (item.id == "MySpace") {
            item.command = (event: any) => {
              this._router.navigate(["/space/my"]);
            };
          }

          // Смотрим уровень профиля.
          if (item.id == "Profile") {
            item.items.forEach((item1: any) => {
              item1.command = (event: any) => {
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
                }
              };
            });
          }

          // Смотрим уровень модулей.
          if (item.id == "Modules") {
            // Смотрим каждый модуль.
            item.items.forEach((item2: any) => {
              // Смотрим модуль УП.
              if (item2.id == "ProjectManagement") {
                // Смотрим элементы уровня модуля УП.
                item2.items.forEach((item3: any) => {
                  // Действия, которые зависят от параметров в url.
                  if (!projectId || isDisableProjectManagementModule) {
                    item3.disabled = ["Wiki", "Tasks", "Backlog", "Sprints"].includes(item3.id);
                  }

                  // Команды уровня элементов модуля УП.
                  item3.command = async (event: any) => {
                    switch (event.item.id) {
                      case "WorkSpaces":
                        await this._router.navigate(["/project-management/workspaces"]);
                        break;

                      case "Wiki":
                        await this._router.navigate(["/project-management/wiki"], {
                          queryParams: {
                            projectId
                          }
                        });
                        break;

                      case "Tasks":
                        await this._router.navigate(["/project-management/space"], {
                          queryParams: {
                            projectId
                          }
                        });
                        break;

                      case "Backlog":
                        await this._router.navigate(["/project-management/space/backlog"], {
                          queryParams: {
                            projectId
                          }
                        });
                        break;

                      case "Sprints":
                        await this._router.navigate(["/project-management/sprints"], {
                          queryParams: {
                            projectId
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

                      case "CreateProject":
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
                              await this._router.navigate(["/profile/projects/create"]);
                            }
                          });
                        break;

                      case "UserProjects":
                        await this._router.navigate(["/profile/projects/my"]);
                        break;

                      case "ArchivedProjects":
                        await  this._router.navigate(["/projects/archive"]);
                        break;
                    }
                  }
                });
              }

              // Смотрим модуль HR.
              if (item2.id == "HR") {
                // Смотрим элементы уровня модуля УП.
                item2.items.forEach((item3: any) => {
                  // Действия, которые зависят от параметров в url.
                  if (!projectId || isDisableProjectManagementModule) {
                    item3.disabled = ["Wiki", "Tasks", "Backlog", "Sprints"].includes(item3.id);
                  }

                  // Команды уровня элементов модуля УП.
                  item3.command = async (event: any) => {
                    switch (event.item.id) {
                      case "WorkSpaces":
                        await this._router.navigate(["/project-management/workspaces"]);
                        break;

                      case "Wiki":
                        await this._router.navigate(["/project-management/wiki"], {
                          queryParams: {
                            projectId
                          }
                        });
                        break;

                      case "CreateVacancy":
                        await this._router.navigate(["/vacancies/create"]);
                        break;

                      case "UserVacancies":
                        await  this._router.navigate(["/vacancies/my"]);
                        break;

                      case "ArchivedVacancies":
                        await  this._router.navigate(["/vacancies/archive"]);
                        break;
                    }
                  }
                });
              }
            });
          }

          // Смотрим уровень каталогов.
          if (item.id == "Catalogs") {
            // Смотрим каждый каталог.
            item.items.forEach((item2: any) => {
              // Команды уровня элементов каталогов.
              item2.command = async (event: any) => {
                switch (event.item.id) {
                  case "CatalogProjects":
                    await this._router.navigate(["/projects"]);
                    break;

                  case "CatalogVacancies":
                    await this._router.navigate(["/vacancies"]);
                    break;

                  case "CatalogVacancies":
                    await this._router.navigate(["/resumes"]);
                    break;
                }
              }
            });
          }
        });
      });
  };

  /**
   * ФФункция переходит к созданию проекта и подставляет параметры, если они нужны.
   */
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
