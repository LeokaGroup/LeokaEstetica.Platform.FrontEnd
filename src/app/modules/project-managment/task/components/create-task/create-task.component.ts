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

    public readonly priorities$ = this._projectManagmentService.priorities$;

    projectId: number = 0;
    projectTaskId: number = 0;
    selectedPriority: any;

    public async ngOnInit() {
        forkJoin([
            this.checkUrlParams(),
            await this.getTaskPrioritiesAsync()
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
    * Функция получает приоритеты задачи для выбора.
    * @returns - Приоритеты задачи.
    */
    private async getTaskPrioritiesAsync() {
        (await this._projectManagmentService.getTaskPrioritiesAsync())
            .subscribe(_ => {
                console.log("Приоритеты задачи для выбора: ", this.priorities$.value);
            });
    };
}