import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { forkJoin } from "rxjs";
import { ProjectManagmentService } from "../../../services/project-managment.service";

@Component({
    selector: "",
    templateUrl: "./create-task.component.html",
    styleUrls: ["./create-task.component.scss"]
})

/**
 * Класс модуля управления проектами (создание задачи).
 */
export class CreateTaskComponent implements OnInit {
    constructor(private readonly _projectManagmentService: ProjectManagmentService,
        private readonly _router: Router,
        private readonly _activatedRoute: ActivatedRoute) {
    }

    projectId: number = 0;
    projectTaskId: number = 0;

    public async ngOnInit() {
        forkJoin([
            this.checkUrlParams(),
        ]).subscribe();
    };

    private async checkUrlParams() {
        this._activatedRoute.queryParams
            .subscribe(async params => {
                console.log("params: ", params);

                this.projectId = params["projectId"];
            });
    };

    /**
    * Функция получает детали задачи по ее Id.
    * @returns - Детали задачи.
    */
    // private async getProjectTaskDetailsAsync() {
    //     (await this._projectManagmentService.getTaskDetailsByTaskIdAsync(this.projectId, this.projectTaskId))
    //         .subscribe(_ => {
    //             console.log("Детали задачи: ", this.taskDetails$.value);
    //         });
    // };
}