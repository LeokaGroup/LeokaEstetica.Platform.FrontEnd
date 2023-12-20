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
    selectedPriority: any;
    selectedTaskType: any;
    selectedTag: any;
    selectedStatus: any;
    selectedExecutor: any;
    selectedWatcher: any;
    taskName: string = "";

    public readonly priorities$ = this._projectManagmentService.priorities$;
    public readonly taskTypes$ = this._projectManagmentService.taskTypes$;
    public readonly taskTags$ = this._projectManagmentService.taskTags$;
    public readonly taskStatuses$ = this._projectManagmentService.taskStatuses$;
    public readonly taskPeople$ = this._projectManagmentService.taskExecutors$;

    public async ngOnInit() {
        forkJoin([
            this.checkUrlParams()
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
    public async onGetTaskPrioritiesAsync() {
        (await this._projectManagmentService.getTaskPrioritiesAsync())
            .subscribe(_ => {
                console.log("Приоритеты задачи для выбора: ", this.priorities$.value);
            });
    };

      /**
    * Функция получает типы задач для выбора.
    * @returns - Типы задач.
    */
      public async onGetTaskTypesAsync() {
        (await this._projectManagmentService.getTaskTypesAsync())
            .subscribe(_ => {
                console.log("Типы задач для выбора: ", this.taskTypes$.value);
            });
    };

      /**
    * Функция получает теги задач для выбора.
    * @returns - Список тегов.
    */
       public async onGetTaskTagsAsync() {
        (await this._projectManagmentService.getTaskTagsAsync())
            .subscribe(_ => {
                console.log("Теги для выбора: ", this.taskTags$.value);
            });
    };

     /**
    * Функция получает статусы задач для выбора.
    * Статусы выводятся в рамках шаблона.
    * @returns - Список статусов.
    */
      public async onGetTaskStatusesAsync() {
        (await this._projectManagmentService.getTaskStatusesAsync(this.projectId))
            .subscribe(_ => {
                console.log("Статусы для выбора: ", this.taskStatuses$.value);
            });
    };

      /**
    * Функция получает исполнителей для выбора.
    * @returns - Список статусов.
    */
      public async onGetSelectTaskPeopleAsync() {
        (await this._projectManagmentService.getSelectTaskPeopleAsync(this.projectId))
            .subscribe(_ => {
                console.log("Исполнители и наблюдатели для выбора: ", this.taskPeople$.value);
            });
    };
}