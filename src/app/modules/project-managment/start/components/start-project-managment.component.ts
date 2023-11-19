import { Component, OnInit } from "@angular/core";
import { forkJoin } from "rxjs";
import { ProjectManagmentService } from "../../services/project-managment.service";

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

    selectedProject: any;

    constructor(private readonly _projectManagmentService: ProjectManagmentService) {
    }

    public async ngOnInit() {
        forkJoin([
          await this.getUseProjectsAsync()
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
}