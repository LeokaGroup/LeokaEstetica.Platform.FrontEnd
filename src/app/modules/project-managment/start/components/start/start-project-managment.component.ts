import { Component, OnInit } from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import { forkJoin } from "rxjs";
import { ProjectManagmentService } from "../../../services/project-managment.service";
import { ConfigSpaceSettingInput } from "../../../task/models/input/config-space-setting-input";

@Component({
    selector: "",
    templateUrl: "./start-project-managment.component.html",
    styleUrls: ["./start-project-managment.component.scss"]
})

/**
 * Класс модуля управления проектами (начальная страница, не Landing).
 */
export class StartProjectManagmentComponent implements OnInit {
    public readonly userProjects$ = this._projectManagmentService.userProjects$;
    public readonly viewStrategies$ = this._projectManagmentService.viewStrategies$;
    public readonly projectManagmentTemplates$ = this._projectManagmentService.projectManagmentTemplates$;
    public readonly projectWorkspaceSettings$ = this._projectManagmentService.projectWorkspaceSettings$;
    public readonly commitedProjectWorkspaceSettings$ = this._projectManagmentService.commitedProjectWorkspaceSettings$;

    selectedProject: any;
    selectedStrategy: any;
    selectedTemplate: any;
    isSelectTemplate: boolean = false;
    aSelectedStatuses: any[] = [];
    isSelectedTemplate: boolean = false;
    isSelectedProject: boolean = false;
    projectManagementProjectName: string = "";
    projectManagementProjectNamePrefix: string = "";
    projectId: number = 0;

  constructor(private readonly _projectManagmentService: ProjectManagmentService,
              private readonly _router: Router,
              private readonly _activatedRoute: ActivatedRoute) {
  }

    public async ngOnInit() {
        forkJoin([
            this.checkUrlParams(),
            await this.getUseProjectsAsync(),
            await this.getViewStrategiesAsync(),
            await this.getProjectManagmentTemplatesAsync()
        ]).subscribe();
    };

  private checkUrlParams() {
    this._activatedRoute.queryParams
      .subscribe(params => {
        this.projectId = params["projectId"];
      });
  };

    /**
  * Функция получает список проектов пользователя.
  * @returns - Список проектов.
  */
    private async getUseProjectsAsync() {
        (await this._projectManagmentService.getUseProjectsAsync())
            .subscribe(_ => {
                console.log("Проекты пользователя для УП: ", this.userProjects$.value.userProjects);
            });
    };

    /**
  * Функция получает список стратегий представления.
  * @returns - Список стратегий.
  */
    private async getViewStrategiesAsync() {
        (await this._projectManagmentService.getViewStrategiesAsync())
            .subscribe(_ => {
                console.log("Стратегии представления для УП: ", this.viewStrategies$.value);
            });
    };

    /**
     * Функция переходит в рабочее пространство проекта.
     * Если пользователь ранее выбирал настройки, то не отображаем к выбору настройки, а применяем ссылку с бэка.
     */
    public async onRouteWorkSpace() {
        console.log("selectedProject", this.selectedProject);
        console.log("selectedStrategy", this.selectedStrategy);

        // Можем взять templateId от любого статуса, так как все статусы будут принадлежать одному шаблону,
        // который выбран пользователем.
        let configSpaceSettingInput = new ConfigSpaceSettingInput();
        configSpaceSettingInput.projectId = this.projectId;
        configSpaceSettingInput.projectManagementName = this.projectManagementProjectName;
        configSpaceSettingInput.projectManagementNamePrefix = this.projectManagementProjectNamePrefix;

        let strategy = this.selectedStrategy.viewStrategySysName.toLowerCase();

        if (strategy == "kanban") {
            strategy = "kn";
        }

        else if (strategy == "scrum") {
            strategy = "sm";
        }

        configSpaceSettingInput.strategy = strategy;
        configSpaceSettingInput.templateId = this.selectedTemplate.projectManagmentTaskStatusTemplates[0].templateId;

        (await this._projectManagmentService.commitSpaceSettingsAsync(configSpaceSettingInput))
            .subscribe(_ => {
                if (this.commitedProjectWorkspaceSettings$.value.isCommitProjectSettings) {
                    window.location.href = this.commitedProjectWorkspaceSettings$.value.projectManagmentSpaceUrl;
                }
            });
    };

    /**
     * Функция отображает модалку выбора шаблона.
     */
    public onSelectStrategy() {
        this.isSelectTemplate = true;
    };

    /**
     * Функция подтягивает статусы выбранного шаблона.
     */
    public onChangeTemplate() {
        this.aSelectedStatuses = [];

        // Перебираем статусы выбранного шаблона, чтобы добавить их в массив статусов и отобразить на UI.
        this.selectedTemplate.projectManagmentTaskStatusTemplates.forEach((el: any) => {
            this.aSelectedStatuses.push({
                statusName: el.statusName,
                templateId: el.templateId,
                statusId: el.statusId
            });
        });
    };

    /**
* Функция получает список шаблонов со статусами для выбора пользователю
* @returns - Список шаблонов.
*/
    private async getProjectManagmentTemplatesAsync() {
        (await this._projectManagmentService.getProjectManagmentTemplatesAsync())
            .subscribe(_ => {
                console.log("Шаблоны для выбора: ", this.projectManagmentTemplates$.value);
                // Установка первого шаблона выбранным по-умолчанию
                if (this.projectManagmentTemplates$.value.length) {
                    this.selectedTemplate = this.projectManagmentTemplates$.value[0];
                    this.onChangeTemplate();
                }
            });
    };

    /**
     * Функция фиксирует выбор шаблона пользователем.
     */
    public onSelectTemplate() {
        this.isSelectedTemplate = true;
        this.isSelectTemplate = false;
    };

    /**
     * Функция фиксирует выбранный проект пользователя.
     */
    public onSelectProject() {
        this.isSelectedProject = this.selectedProject !== undefined && this.selectedProject?.projectId > 0;
    };

    public onUpdateProjectManagementProjectName() {
      if (this.projectManagementProjectName.includes(" ")) {
        let arr = this.projectManagementProjectName.split(" ");
        this.projectManagementProjectNamePrefix = arr.map((el: string) => el.slice(0, 1).toUpperCase()).join("");

      } else {
        this.projectManagementProjectNamePrefix = this.projectManagementProjectName.slice(0, 2).toUpperCase();
      }
    };
}
