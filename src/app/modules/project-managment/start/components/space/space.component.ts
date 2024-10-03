import {Component, OnInit, Sanitizer} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { firstValueFrom, tap } from "rxjs";
import { RedirectService } from "src/app/common/services/redirect.service";
import { ProjectManagmentService } from "../../../services/project-managment.service";
import {DomSanitizer} from "@angular/platform-browser";
import {ChangeTaskStatusInput} from "../../../task/models/input/change-task-status-input";
import { MenuItem } from "primeng/api";
import { Menu } from "primeng/menu";
import {FixationStrategyInput} from "../../../task/models/input/fixation-strategy-input";

@Component({
    selector: "",
    templateUrl: "./space.component.html",
    styleUrls: ["./space.component.scss"]
})

/**
 * Класс компонента управления проектами (рабочее пространство).
 */
export class SpaceComponent implements OnInit {
  constructor(private readonly _projectManagmentService: ProjectManagmentService,
              private readonly _router: Router,
              private readonly _redirectService: RedirectService,
              private readonly _activatedRoute: ActivatedRoute,
              private readonly _domSanitizer: DomSanitizer,
              private readonly _sanitizer: Sanitizer) {
  }

    public readonly headerItems$ = this._projectManagmentService.headerItems$;
    public readonly workSpaceConfig$ = this._projectManagmentService.workSpaceConfig$;
    readonly projectTags$ = this._projectManagmentService.projectTags$;
    public readonly selectedWorkSpace$ = this._projectManagmentService.selectedWorkSpace$;
    public readonly quickActions$ = this._projectManagmentService.quickActions$;

    aHeaderItems: any[] = [];
    aPanelItems: any[] = [];
    selectedProjectId: number = 0;
    selectedStrategy: string = "";
    selectedTemplateId: number = 0;
    aStatuses: any[] = [];
    tagNames: any[] = [];
    isLow: boolean = false;
    isMedium: boolean = false;
    isHigh: boolean = false;
    isUrgent: boolean = false;
    isBlocker: boolean = false;
    isLoading: boolean = false;
    isPanelMenu: boolean = false;
    dragged: DraggedTask = null;
    dropdownMenuItems: MenuItem[] | undefined;
    mode: string = "";

  public async ngOnInit() {
    this.checkUrlParams();
    await this.getHeaderItemsAsync();
    await this.getProjectTagsAsync();
    await this.getConfigurationWorkSpaceBySelectedTemplateAsync();
    await this.getSelectedWorkSpaceAsync();
    await this.getProjectManagementLineMenuAsync();
  };

    async getProjectTagsAsync() {
      firstValueFrom((await this._projectManagmentService.getProjectTagsAsync(this.selectedProjectId))
        .pipe(
          tap((v) => this.tagNames = <any[]>v)
        ));
    }

    /**
  * Функция получает список элементов меню хидера (верхнее меню).
  * @returns - Список элементов.
  */
    private async getHeaderItemsAsync() {
        (await this._projectManagmentService.getHeaderItemsAsync())
            .subscribe(_ => {
                console.log("Хидер УП: ", this.headerItems$.value);
                this.aHeaderItems = this.headerItems$.value;
                this.aPanelItems = this.headerItems$.value.panelItems;
            });
    };

    private async checkUrlParams() {
        this._activatedRoute.queryParams
          .subscribe(async params => {
            this.selectedProjectId = params["projectId"];
            this.selectedStrategy = params["view"];
            this.selectedTemplateId = params["tm"];
          });
      };

      /**
    * Функция получает конфигурацию рабочего пространства по выбранному шаблону.
    * Под конфигурацией понимаются основные элементы рабочего пространства (набор задач, статусов, фильтров, колонок и тд)
    * если выбранный шаблон это предполагает.
    * @returns - Данные конфигурации.
    */
    private async getConfigurationWorkSpaceBySelectedTemplateAsync() {
        // Если нет проекта, то редиректим в общее пространство.
        if (!this.selectedProjectId) {
          this._router.navigate(["/project-management/workspaces"]);

          return;
        }

        (await this._projectManagmentService.getConfigurationWorkSpaceBySelectedTemplateAsync(this.selectedProjectId,
            null, 1, "Space"))
            .subscribe(_ => {
              // Нет доступа к раб.пространству проекта.
              if (!this.workSpaceConfig$.value.isAccess) {
                this._router.navigate(["/forbidden"]);
                return;
              }

                console.log("Конфигурация рабочего пространства: ", this.workSpaceConfig$.value);
                this.mode = this.workSpaceConfig$.value.strategy;

              this.workSpaceConfig$.value?.projectManagmentTaskStatuses?.forEach((p1: any) => {
                p1.projectManagmentTasks?.forEach((p2: any) => {
                  if (p2.executor?.avatar != null) {
                    let byteCharacters = atob(p2.executor.avatar.fileContents);
                    let byteNumbers = new Array(byteCharacters.length);
                    for (let i = 0; i < byteCharacters.length; i++) {
                      byteNumbers[i] = byteCharacters.charCodeAt(i);
                    }
                    let byteArray = new Uint8Array(byteNumbers);
                    let blob = new Blob([byteArray], {type: "application/octet-stream"});
                    let href = URL.createObjectURL(blob);
                    p2.executor.avatar.ava = this._domSanitizer.bypassSecurityTrustUrl(href);
                  }
                });
              });
            });
    };

  /**
   * Функция получает конфигурацию рабочего пространства по выбранному шаблону (Клик на "Показать больше").
   * Под конфигурацией понимаются основные элементы рабочего пространства (набор задач, статусов, фильтров, колонок и тд)
   * если выбранный шаблон это предполагает.
   * @returns - Данные конфигурации.
   */
  public async onGetConfigurationWorkSpaceBySelectedTemplateAsync(pageNumber: number, taskStatusId: number) {
    this.isLoading = true;

    (await this._projectManagmentService.getConfigurationWorkSpaceBySelectedTemplateAsync(this.selectedProjectId,
      taskStatusId, ++pageNumber, "Space"))
      .subscribe(_ => {
        // Нет доступа к раб.пространству проекта.
        if (!this.workSpaceConfig$.value.isAccess) {
          this._router.navigate(["/forbidden"]);
          return;
        }

        console.log("Конфигурация рабочего пространства: ", this.workSpaceConfig$.value);

        this.mode = this.workSpaceConfig$.value.strategy;

        this.workSpaceConfig$.value?.projectManagmentTaskStatuses?.forEach((p1: any) => {
          p1.projectManagmentTasks?.forEach((p2: any) => {
            if (p2.executor?.avatar != null) {
              let byteCharacters = atob(p2.executor.avatar.fileContents);
              let byteNumbers = new Array(byteCharacters.length);
              for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
              }
              let byteArray = new Uint8Array(byteNumbers);
              let blob = new Blob([byteArray], {type: "application/octet-stream"});
              let href = URL.createObjectURL(blob);
              p2.executor.avatar.ava = this._domSanitizer.bypassSecurityTrustUrl(href);
            }
          });
        });

        this.isLoading = false;
      });
  };

    /**
     * Функция переходит к деталям задачи.
     * @param projectTaskId - Id задачи в рамках проекта.
     * @param taskTypeId - Тип задачи.
     */
    public onSelectTask(projectTaskId: string, taskTypeId: number) {
        let projectId = this.selectedProjectId;
        let companyId: number = this._projectManagmentService.companyId;

        localStorage["t_t_i"] = taskTypeId;

        this._router.navigate(["/project-management/space/details"], {
            queryParams: {
                projectId,
                taskId: projectTaskId,
                companyId
            }
        });
    };

    public onSelectPanelMenu() {
      this._projectManagmentService.isLeftPanel = true;
    };

    public onClosePanelMenu() {
      this._projectManagmentService.isLeftPanel = false;
    };

    dragStart(task: any, fromStatus: any) {
      this.dragged = {
        task: task,
        fromStatus: fromStatus,
      } as DraggedTask
    }

  async onDropAsync(toStatus: any) {
    if (this.dragged) {
      const movedTask = this.dragged.task;
      const fromStatus = this.dragged.fromStatus;
      console.log(fromStatus, toStatus);

      if (toStatus.statusId !== fromStatus.statusId) {
        let changeTaskStatusInput = new ChangeTaskStatusInput();
        changeTaskStatusInput.projectId = this.selectedProjectId;
        changeTaskStatusInput.taskId = movedTask.projectTaskId;
        changeTaskStatusInput.taskDetailType = movedTask.taskTypeId;
        changeTaskStatusInput.changeStatusId = toStatus.statusId;

        (await this._projectManagmentService.changeTaskStatusAsync(changeTaskStatusInput))
          .subscribe(async _ => {
            fromStatus.projectManagmentTasks = fromStatus.projectManagmentTasks.filter((task: any) => task.taskId !== movedTask.taskId);
            fromStatus.total = fromStatus.projectManagmentTasks.length;
            toStatus.projectManagmentTasks = [movedTask, ...(toStatus.projectManagmentTasks ?? [])];
            toStatus.total = toStatus.projectManagmentTasks.length;
          });
      }
    }
  }

  dragEnd() {
    this.dragged = null;
  }

    /**
     * Функция управления показом выпадающего меню в задачах.
     * @param menu - элемент меню.
     * @param event - событие.
     * @param task - задача, для которой показывается меню.
     */
    onClickDropdownMenu(menu: Menu, event: MouseEvent, task: any) {
      event.stopPropagation();
      this.dropdownMenuItems = [
        {
          label: 'Редактировать',
          command: () => this.onSelectTask(task.projectTaskId, task.taskTypeId)
        },
        {
          label: 'Скрыть из общего доступа',
          command: () => console.log('onClickDropdownMenu: Скрыть из общего доступа')
        },
        {
          label: 'Архивировать',
          command: () => console.log('onClickDropdownMenu: Архивировать')
        },
        {
          label: 'Удалить',
          command: () => console.log('onClickDropdownMenu: Удалить')
        }
      ];
      menu.toggle(event);
    }

  /**
   * Функция получает выбранное раб.пространство.
   */
  private async getSelectedWorkSpaceAsync() {
    (await this._projectManagmentService.getSelectedWorkSpaceAsync(this.selectedProjectId))
      .subscribe(_ => {
        console.log("Выбранное раб.пространство: ", this.selectedWorkSpace$.value);

        this._projectManagmentService.companyId = this.selectedWorkSpace$.value.companyId;
      });
  }

  /**
   * Функция получает элементы меню для блока быстрых действий в раб.пространстве проекта.
   */
  private async getProjectManagementLineMenuAsync() {
    (await this._projectManagmentService.getProjectManagementLineMenuAsync())
      .subscribe(_ => {
        console.log("Меню быстрых действий: ", this.quickActions$.value);

        let projectId = this.selectedProjectId;

        this.quickActions$.value.items.forEach((item: any) => {
          switch (item.id) {
            case "ScrumView":
              item.command = async (event: any) => {
                let fixationScrumInput: FixationStrategyInput = new FixationStrategyInput();
                fixationScrumInput.projectId = projectId;
                fixationScrumInput.strategySysName = "Scrum";

                (await this._projectManagmentService.fixationSelectedViewStrategyAsync(fixationScrumInput))
                  .subscribe(_ => {
                    window.location.reload();
                  });
              };
              break;

            case "KanbanView":
              item.command = async (event: any) => {
                let fixationKanbanInput: FixationStrategyInput = new FixationStrategyInput();
                fixationKanbanInput.projectId = projectId;
                fixationKanbanInput.strategySysName = "Kanban";

                (await this._projectManagmentService.fixationSelectedViewStrategyAsync(fixationKanbanInput))
                  .subscribe(_ => {
                    window.location.reload();
                  });
              };
              break;

            case "CreateAction":
              item.items.forEach((item1: any) => {
                item1.command = async (event: any) => {
                  switch (event.item.id) {
                    case "CreateTask":
                      await this._router.navigate(["/project-management/space/create"], {
                        queryParams: {
                          projectId
                        }
                      });
                      break;
                  }
                };
              });
              break;

            case "Settings":
              item.items.forEach((item1: any) => {
                item1.command = async (event: any) => {
                  switch (event.item.id) {
                    case "ProjectSettings":
                      await this._router.navigate(["/project-management/space/project-settings"], {
                        queryParams: {
                          projectId,
                          companyId: +this._projectManagmentService.companyId
                        }
                      });
                      break;

                    case "ViewSettings":
                      await this._router.navigate(["/project-management/space/view-settings"], {
                        queryParams: {
                          projectId
                        }
                      });
                      break;
                  }
                };
              });
              break;
          }
        });
      });
  }
}

type DraggedTask = {
  task: any;
  fromStatus: any;
} | null
