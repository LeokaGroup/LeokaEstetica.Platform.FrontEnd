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

  public onSelectPanelMenu() {
    console.log("onSelectPanelMenu");
    this._projectManagmentService.isLeftPanel = true;
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
}
