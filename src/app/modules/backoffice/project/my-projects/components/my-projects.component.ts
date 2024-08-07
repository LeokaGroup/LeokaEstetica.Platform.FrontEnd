import { Component, OnInit } from "@angular/core";
import { forkJoin } from "rxjs";
import { MessageService } from "primeng/api";
import { BackOfficeService } from "../../../services/backoffice.service";
import { Router } from "@angular/router";
import { ProjectService } from "src/app/modules/project/services/project.service";
import {AddProjectArchiveInput} from "../../../models/input/project/add-project-archive-input";

@Component({
    selector: "my-projects",
    templateUrl: "./my-projects.component.html",
    styleUrls: ["./my-projects.component.scss"]
})

/**
 * Класс проектов пользователя.
 */
export class MyProjectsComponent implements OnInit {
    public readonly projectColumns$ = this._backofficeService.projectColumns$;
    public readonly userProjects$ = this._backofficeService.userProjects$;
  public readonly archivedProject$ = this._backofficeService.archivedProject$;

    products: any[] = [];
    selectedProjects: any;
    isSelectionPageOnly: boolean = true;
    isDeleteProject: boolean = false;
    projectId: number = 0;
    projectName: string = "";

    constructor(private readonly _backofficeService: BackOfficeService,
        private readonly _messageService: MessageService,
        private readonly _router: Router,
        private readonly _projectService: ProjectService) {

    }

    public async ngOnInit() {
        forkJoin([
           await this.getProjectsColumnNamesAsync(),
           await this.getUserProjectsAsync()
        ]).subscribe();
    };

    /**
    // * Функция получает поля таблицы проектов пользователя.
    // * @returns - Список полей.
    */
    private async getProjectsColumnNamesAsync() {
        (await this._backofficeService.getProjectsColumnNamesAsync())
            .subscribe(_ => {
                console.log("Столбцы таблицы проектов пользователя: ", this.projectColumns$.value);
            });
    };

    /**
     * Функция получает список проектов пользователя.
     * @returns Список проектов.
     */
    private async getUserProjectsAsync() {
        (await this._backofficeService.getUserProjectsAsync(false))
        .subscribe(_ => {
            console.log("Проекты пользователя:", this.userProjects$.value);
        });
    };

    /**
     * Функция получает выделенный проект.
     */
    public onSelectProject() {
        console.log(this.selectedProjects);
    };

    /**
     * Функция переходит на страницу редактирования проекта и подставляет в роут Id проекта.
     * @param projectId - Id проекта.
     */
    public onRouteEditProject(projectId: number) {
        this._router.navigate(["/projects/project"], {
            queryParams: {
                projectId,
                mode: "edit"
            }
        });
    };

    /**
     * Функция переходит на страницу просмотра проекта и подставляет в роут Id проекта.
     * @param projectId - Id проекта.
     */
     public onRouteViewProject(projectId: number) {
        this._router.navigate(["/projects/project"], {
            queryParams: {
                projectId,
                mode: "view"
            }
        });
    };

    /**
     * Функция удаляет проект.
     */
     public async onDeleteProjectAsync() {
        (await this._projectService.deleteProjectsAsync(this.projectId))
        .subscribe(async (response: any) => {
            console.log("Удалили проект: ", response);
            this.isDeleteProject = false;

            await this.getUserProjectsAsync();
        });
    };

    public onBeforeDeleteProject(projectId: number, projectName: string) {
        this.projectId = projectId;
        this.projectName = projectName;
        this.isDeleteProject = true;
    };

  /**
   * Функция добавляет проект в архив.
   * @param projectId - Id проекта.
   */
  public async onAddArchiveProjectAsync(projectId: number) {
    let projectArchiveInput = new AddProjectArchiveInput();
    projectArchiveInput.projectId = projectId;

    (await this._projectService.addArchiveProjectAsync(projectArchiveInput))
      .subscribe(async _ => {
        console.log("Проект добавлен в архив", this.archivedProject$.value);  

        await this.getUserProjectsAsync();  
      });
  };
}
