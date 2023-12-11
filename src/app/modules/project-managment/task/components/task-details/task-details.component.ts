import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { forkJoin } from "rxjs";
import { ProjectManagmentService } from "../../../services/project-managment.service";

@Component({
    selector: "",
    templateUrl: "./task-details.component.html",
    styleUrls: ["./task-details.component.scss"]
})

/**
 * Класс модуля управления проектами (детали задачи).
 */
export class TaskDetailsComponent implements OnInit {
    constructor(private readonly _projectManagmentService: ProjectManagmentService,
        private readonly _router: Router,
        private readonly _activatedRoute: ActivatedRoute) {
    }

    public readonly taskDetails$ = this._projectManagmentService.taskDetails$;
    public readonly headerItems$ = this._projectManagmentService.headerItems$;

    projectId: number = 0;
    projectTaskId: number = 0;
    aHeaderItems: any[] = [];
    home: string = "project name";
    items: any[] = [
        {
            label: "[Тут будет название проекта]"
        },
        {
            label: "[Тут будет префикс проекта + название задачи]"
        }
    ];

    public async ngOnInit() {
        forkJoin([
            this.checkUrlParams(),
            await this.getProjectTaskDetailsAsync(),
            await this.getHeaderItemsAsync()
        ]).subscribe();
    };

    private async checkUrlParams() {
        this._activatedRoute.queryParams
            .subscribe(async params => {
                console.log("params: ", params);

                this.projectId = params["projectId"];
                this.projectTaskId = params["taskId"];
            });
    };

       /**
  * Функция получает список элементов меню хидера (верхнее меню).
  * @returns - Список элементов.
  */
        private async getHeaderItemsAsync() {
            (await this._projectManagmentService.getHeaderItemsAsync())
                .subscribe(_ => {
                    console.log("Хидер УП: ", this.headerItems$.value);
                    this.aHeaderItems = this.headerItems$.value;
                });
        };

    /**
    * Функция получает детали задачи по ее Id.
    * @returns - Детали задачи.
    */
    private async getProjectTaskDetailsAsync() {
        (await this._projectManagmentService.getTaskDetailsByTaskIdAsync(this.projectId, this.projectTaskId))
            .subscribe(_ => {
                console.log("Детали задачи: ", this.taskDetails$.value);
            });
    };
}