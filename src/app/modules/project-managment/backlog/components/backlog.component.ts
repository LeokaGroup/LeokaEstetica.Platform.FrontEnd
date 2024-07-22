import {Component, OnInit, Sanitizer} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { forkJoin } from "rxjs";
import { RedirectService } from "src/app/common/services/redirect.service";
import { ProjectManagmentService } from "../../services/project-managment.service";
import {DomSanitizer} from "@angular/platform-browser";

@Component({
  selector: "",
  templateUrl: "./backlog.component.html",
  styleUrls: ["./backlog.component.scss"]
})

/**
 * Класс компонента управления проектами (бэклог).
 */
export class BacklogComponent implements OnInit {
  constructor(private readonly _projectManagmentService: ProjectManagmentService,
              private readonly _router: Router,
              private readonly _redirectService: RedirectService,
              private readonly _activatedRoute: ActivatedRoute,
              private readonly _domSanitizer: DomSanitizer,
              private readonly _sanitizer: Sanitizer) {
  }

  public readonly backlogData$ = this._projectManagmentService.backlogData$;

  selectedProjectId: number = 0;
  isLoading: boolean = false;
  isActiveMenu: boolean = false;
  checkedTasks: any[] = [];
  taskCount: string = '';

  public async ngOnInit() {
    this._projectManagmentService.isLeftPanel = false;

    forkJoin([
      this.checkUrlParams(),
      await this.getBacklogTasksAsync(),
      await this.getConfigurationWorkSpaceBySelectedTemplateAsync()
    ]).subscribe();
  };

  private async checkUrlParams() {
    this._activatedRoute.queryParams
      .subscribe(async params => {
        this.selectedProjectId = params["projectId"];
      });
  };

  private async getBacklogTasksAsync() {
    (await this._projectManagmentService.getBacklogTasksAsync(+this.selectedProjectId))
      .subscribe(_ => {
        console.log("Задачи, истории бэклога: ", this.backlogData$.value);
      });
  };

  /**
   * Функция получает конфигурацию рабочего пространства по выбранному шаблону.
   * Под конфигурацией понимаются основные элементы рабочего пространства (набор задач, статусов, фильтров, колонок и тд)
   * если выбранный шаблон это предполагает.
   * @returns - Данные конфигурации.
   */
  private async getConfigurationWorkSpaceBySelectedTemplateAsync() {
    (await this._projectManagmentService.getConfigurationWorkSpaceBySelectedTemplateAsync(this.selectedProjectId,
      null, 1, "Backlog"))
      .subscribe(_ => {
        // Нет доступа к раб.пространству проекта.
        if (!this.backlogData$.value.isAccess) {
          this._router.navigate(["/forbidden"]);
          return;
        }

        console.log("Конфигурация рабочего пространства: ", this.backlogData$.value);

        this.backlogData$.value?.projectManagmentTaskStatuses?.forEach((p1: any) => {
          p1.projectManagmentTasks?.forEach((p2: any) => {
            let byteCharacters = atob(p2.executor.avatar.fileContents);
            let byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            let byteArray = new Uint8Array(byteNumbers);
            let blob = new Blob([byteArray], {type: "application/octet-stream"});
            let href = URL.createObjectURL(blob);
            p2.executor.avatar.ava = this._domSanitizer.bypassSecurityTrustUrl(href);
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
      taskStatusId, ++pageNumber, "Backlog"))
      .subscribe(_ => {
        // Нет доступа к раб.пространству проекта.
        if (!this.backlogData$.value.isAccess) {
          this._router.navigate(["/forbidden"]);
          return;
        }

        console.log("Конфигурация рабочего пространства: ", this.backlogData$.value);

        this.backlogData$.value?.projectManagmentTaskStatuses?.forEach((p1: any) => {
          p1.projectManagmentTasks?.forEach((p2: any) => {
            let byteCharacters = atob(p2.executor.avatar.fileContents);
            let byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            let byteArray = new Uint8Array(byteNumbers);
            let blob = new Blob([byteArray], {type: "application/octet-stream"});
            let href = URL.createObjectURL(blob);
            p2.executor.avatar.ava = this._domSanitizer.bypassSecurityTrustUrl(href);
          });
        });

        this.isLoading = false;
      });
  };

  /**
   * Функция переходит к деталям задачи.
   * @param projectTaskId - Id задачи в рамках проекта.
   */
  public onSelectTask(projectTaskId: string) {
    let projectId = this.selectedProjectId;

    this._router.navigate(["/project-management/space/details"], {
      queryParams: {
        projectId,
        taskId: projectTaskId
      }
    });
  };

  /**
   * Функция переходит к планированию спринта.
   */
  public onRoutePlaningSprint() {
    let projectId = this.selectedProjectId;

    this._router.navigate(["/project-management/space/sprint/planing"], {
      queryParams: {
        projectId
      }
    });
  };

  /**
   * Функция проверяет есть ли выбранные задачи и, если да, открывает меню с кнопкой "Добавить в спринт"
   */
  public openTaskMenu() {
    let length = this.checkedTasks.length;
    this.pluralForms();
       
    this.isActiveMenu = length !== 0 ? true : false;
  }

  public pluralForms() {
    let chooseWords = ['выбрана', 'выбрано', 'выбрано'];
    let taskWords = ['задача', 'задачи', 'задач']
    let i = (
      length % 10 == 1 && length % 100 != 11 ? 0 :
      length % 10 >= 2 && length % 10 <= 4 && (
      length % 100 < 10 || length % 100 >= 20 ) ? 1 : 2
    );

    this.taskCount = chooseWords[i] + " " + length + " " + taskWords[i];
  }

   /**
   * Функция добавляет задачи в спринт.
   * @param checkedTasks - выбранные через чекбоксы задачи.
   */
   public async addTasksToSprint() {
    // Написать функцию
   };

  public onSelectPanelMenu() {
    this._projectManagmentService.isLeftPanel = true;
  };

  public onClosePanelMenu() {
    this._projectManagmentService.isLeftPanel = false;
  };

  /**
   * Функция переходит на страницу спринтов.
   */
  public async onRouteSprints() {
    let projectId = this.selectedProjectId;

    this._router.navigate(["/project-management/sprints"], {
      queryParams: {
        projectId
      }
    });
  };
}
