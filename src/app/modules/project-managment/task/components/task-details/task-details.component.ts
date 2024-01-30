import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { forkJoin } from "rxjs";
import { ProjectManagmentService } from "../../../services/project-managment.service";
import { ChangeTaskDetailsInput } from "../../models/input/change-task-details-input";
import { ChangeTaskNameInput } from "../../models/input/change-task-name-input";
import { ChangeTaskStatusInput } from "../../models/input/change-task-status-input";
import { ProjectTaskTagInput } from "../../models/input/project-task-tag-input";

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
    public readonly taskStatuses$ = this._projectManagmentService.taskStatuses$;
    public readonly availableTransitions$ = this._projectManagmentService.availableTransitions$;
    public readonly projectTags$ = this._projectManagmentService.projectTags$;

    projectId: number = 0;
    projectTaskId: number = 0;
    isClosable: boolean = true;
    isActiveTaskName: boolean = false;
    isActiveTaskDetails: boolean = false;
    selectedStatus: any;
    taskDetails: string = "";
    taskName: string = "";
    selectedTag: any;
    selectedWatcher: any;

    formStatuses: FormGroup = new FormGroup({
        "statusName": new FormControl("", [
            Validators.required
        ])
    });

    public async ngOnInit() {
        forkJoin([
            this.checkUrlParams(),
            await this.getProjectTaskDetailsAsync(),
            await this.getProjectTagsAsync()
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
    * Функция получает детали задачи по ее Id.
    * @returns - Детали задачи.
    */
    private async getProjectTaskDetailsAsync() {
        (await this._projectManagmentService.getTaskDetailsByTaskIdAsync(this.projectId, this.projectTaskId))
            .subscribe(async _ => {
                console.log("Детали задачи: ", this.taskDetails$.value);

                // Получаем статусы задач для выбора, чтобы подставить ранее сохраненый статус.
                (await this._projectManagmentService.getAvailableTaskStatusTransitionsAsync(this.projectId, this.projectTaskId))
                .subscribe(_ => {
                    console.log("Возможные переходы статусов задачи: ", this.availableTransitions$.value);

                    // Записываем текущий статус задачи в выпадающий список.
                    let value = this.availableTransitions$.value.find((st: any) => st.taskStatusId == this.taskDetails$.value.taskStatusId);
                    this.formStatuses.get("statusName")?.setValue(value);

                    this.taskDetails = this.taskDetails$.value?.details;
                    this.taskName = this.taskDetails$.value?.name;
                });
            });
    };

    public onActivateTaskName() {
        this.isActiveTaskName = !this.isActiveTaskName;
    };

    public onActivateTaskDetails() {
        this.isActiveTaskDetails = !this.isActiveTaskDetails;
    };

    /**
     * Функция изменяет статус задачи.
     */
    public async onChangeStatusAsync() {
        let changeTaskStatusInput = new ChangeTaskStatusInput();
        changeTaskStatusInput.projectId = this.projectId;
        changeTaskStatusInput.taskId = this.projectTaskId;
        changeTaskStatusInput.changeStatusId = this.selectedStatus.taskStatusId;

        (await this._projectManagmentService.changeTaskStatusAsync(changeTaskStatusInput))
        .subscribe(async _ => {
             // Получаем все статусы шаблона проекта.
             (await this._projectManagmentService.getTaskStatusesAsync(this.projectId))
             .subscribe(async _ => {
                 console.log("Статусы для выбора: ", this.taskStatuses$.value);

                 // Получаем статусы задач для выбора, чтобы подставить ранее сохраненый статус.
                 (await this._projectManagmentService.getAvailableTaskStatusTransitionsAsync(this.projectId, this.projectTaskId))
                     .subscribe(_ => {
                         console.log("Возможные переходы статусов задачи: ", this.availableTransitions$.value);

                         let value = this.availableTransitions$.value.find((st: any) => st.statusId == this.selectedStatus.taskStatusId);
                         this.formStatuses.get("statusName")?.setValue(value);
                     });
             });
        });
    };

    /**
     * Функция сохраняет название задачи.
     */
    public async onSaveTaskNameAsync(taskName: string) {
        this.isActiveTaskName = !this.isActiveTaskName;

        let modelInput = new ChangeTaskNameInput();
        modelInput.projectId = this.projectId;
        modelInput.taskId = this.projectTaskId;
        modelInput.changedTaskName = taskName;

        (await this._projectManagmentService.saveTaskNameAsync(modelInput))
            .subscribe(_ => {});
    };

    /**
     * Функция сохраняет описание задачи.
     */
     public async onSaveTaskDetailsAsync(taskDetails: string) {
        this.isActiveTaskDetails = !this.isActiveTaskDetails;

        let modelInput = new ChangeTaskDetailsInput();
        modelInput.projectId = this.projectId;
        modelInput.taskId = this.projectTaskId;
        modelInput.changedTaskDetails = taskDetails;

        (await this._projectManagmentService.saveTaskDetailsAsync(modelInput))
            .subscribe(_ => {});
    };

    /**
  * Функция получает теги проекта для выбора.
  * @returns - Список тегов.
  */
    private async getProjectTagsAsync() {
        (await this._projectManagmentService.getProjectTagsAsync())
            .subscribe(_ => {
                console.log("Теги для выбора: ", this.projectTags$.value);
            });
    };

    /**
    * Функция привязывает тег к задаче проекта.
    * Выбор происходит из набора тегов проекта.
    * @param projectTaskTagInput - Входная модель.
    */
    public async onAttachTaskTagAsync() {
        let projectTaskTagInput = new ProjectTaskTagInput();
        projectTaskTagInput.projectId = +this.projectId;
        projectTaskTagInput.projectTaskId = +this.projectTaskId;
        projectTaskTagInput.tagId = this.selectedTag.tagId;

        (await this._projectManagmentService.attachTaskTagAsync(projectTaskTagInput))
            .subscribe(async _ => {
                await this.getProjectTaskDetailsAsync();
            });
    };

    /**
    * Функция привязывает тег к задаче проекта.
    * Выбор происходит из набора тегов проекта.
    * @param removedValue - Название тега.
    */
     public async onDetachTaskTagAsync(removedValue: string) {
        let projectTaskTagInput = new ProjectTaskTagInput();
        projectTaskTagInput.projectId = +this.projectId;
        projectTaskTagInput.projectTaskId = +this.projectTaskId;
        projectTaskTagInput.tagId = this.projectTags$.value.filter((item: any) => item.tagName == removedValue)[0].tagId;

         (await this._projectManagmentService.detachTaskTagAsync(projectTaskTagInput))
             .subscribe(async _ => {
                 await this.getProjectTaskDetailsAsync();
             });
    };

    public async onDetachTaskWatcherAsync() {

    };

    public async onAttachTaskWatcherAsync() {

    };
}