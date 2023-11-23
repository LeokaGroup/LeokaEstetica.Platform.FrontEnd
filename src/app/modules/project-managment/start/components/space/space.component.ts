import { Component, OnInit } from "@angular/core";
import { forkJoin } from "rxjs";
import { ProjectManagmentService } from "../../../services/project-managment.service";

@Component({
    selector: "",
    templateUrl: "./space.component.html",
    styleUrls: ["./space.component.scss"]
})

/**
 * Класс модуля управления проектами (рабочее пространство).
 */
export class SpaceComponent implements OnInit {
    constructor(private readonly _projectManagmentService: ProjectManagmentService) {
    }

    public async ngOnInit() {
        forkJoin([
            
        ]).subscribe();
    };

    /**
  * Функция получает список проектов пользователя.
  * @returns - Список проектов.
  */
    // private async getUseProjectsAsync() {
    //     (await this._projectManagmentService.getUseProjectsAsync())
    //         .subscribe(_ => {
    //             console.log("Проекты пользователя для УП: ", this.userProjects$.value.userProjects);
    //         });
    // };
}