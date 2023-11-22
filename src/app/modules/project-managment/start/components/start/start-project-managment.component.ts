import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { forkJoin } from "rxjs";
import { ProjectManagmentService } from "../../../services/project-managment.service";

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

    selectedProject: any;
    selectedStrategy: any;

    constructor(private readonly _projectManagmentService: ProjectManagmentService,
        private readonly _router: Router) {
    }

    public async ngOnInit() {
        forkJoin([
            await this.getUseProjectsAsync(),
            await this.getViewStrategiesAsync()
        ]).subscribe();
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
     */
    public onRouteWorkSpace() {
        console.log("selectedProject", this.selectedProject);
        console.log("selectedStrategy", this.selectedStrategy);

        let projectId = this.selectedProject.projectId;
        let strategy = this.selectedStrategy.viewStrategySysName.toLowerCase();

        if (strategy == "kanban") {
            strategy = "kn";
        }

        else if (strategy == "scrum") {
            strategy = "sm";
        }

        this._router.navigate(["/project-managment/space"], {
            queryParams: {
                projectId,
                view: strategy
            }
        });
    };
}