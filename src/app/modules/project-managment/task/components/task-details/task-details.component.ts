import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { forkJoin } from "rxjs";
import { ProjectManagmentService } from "../../../services/project-managment.service";
import { ChangeTaskDetailsInput } from "../../models/input/change-task-details-input";
import { ChangeTaskNameInput } from "../../models/input/change-task-name-input";
import { ChangeTaskStatusInput } from "../../models/input/change-task-status-input";
import { ProjectTaskExecutorInput } from "../../models/input/project-task-executor-input";
import { ProjectTaskTagInput } from "../../models/input/project-task-tag-input";
import { ProjectTaskWatcherInput } from "../../models/input/project-task-watcher-input";
import { TaskLinkInput } from "../../models/input/task-link-input";
import { TaskPriorityInput } from "../../models/input/task-priority-input";

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
    public readonly priorities$ = this._projectManagmentService.priorities$;
    public readonly taskPeople$ = this._projectManagmentService.taskExecutors$;
    public readonly taskLinkDefault$ = this._projectManagmentService.taskLinkDefault$;
    public readonly taskLinkParent$ = this._projectManagmentService.taskLinkParent$;
    public readonly linkTypes$ = this._projectManagmentService.linkTypes$;
    public readonly linkTasks$ = this._projectManagmentService.linkTasks$;

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
    aPeople: any[] = [];
    selectedExecutor: any;
    selectedPriority: any;
    isVisibleCreateTaskLink: boolean = false;
    selectedLinkType: any;
    selectedTaskLink: any;
    aAvailableActions: any[] = [
        {
            label: 'Связи',
            items: [{
                label: 'Добавить связь',
                icon: 'pi pi-plus',
                command: async () => {
                    await this.onSelectCreateTaskLinkAsync();
                }
            }]
        }
    ];

    formStatuses: FormGroup = new FormGroup({
        "statusName": new FormControl("", [
            Validators.required
        ])
    });

    formPriorities: FormGroup = new FormGroup({
        "priorityName": new FormControl("", [
            Validators.required
        ])
    });

    formExecutors: FormGroup = new FormGroup({
        "executorName": new FormControl("", [
            Validators.required
        ])
    });

    public async ngOnInit() {
        forkJoin([
            this.checkUrlParams(),
            await this.getProjectTaskDetailsAsync(),
            await this.getProjectTagsAsync(),
            await this.getTaskLinkDefaultAsync(),
            await this.getTaskLinkParentAsync()
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
                    .subscribe(async _ => {
                        console.log("Возможные переходы статусов задачи: ", this.availableTransitions$.value);

                        // Записываем текущий статус задачи в выпадающий список.
                        let value = this.availableTransitions$.value.find((st: any) => st.taskStatusId == this.taskDetails$.value.taskStatusId);
                        this.formStatuses.get("statusName")?.setValue(value);

                        this.taskDetails = this.taskDetails$.value?.details;
                        this.taskName = this.taskDetails$.value?.name;

                        (await this._projectManagmentService.getSelectTaskPeopleAsync(this.projectId))
                            .subscribe(_ => {
                                console.log("Исполнители и наблюдатели для выбора: ", this.taskPeople$.value);
                                this.aPeople = this.taskPeople$.value;

                                let value = this.taskPeople$.value.find((st: any) => st.userId == this.taskDetails$.value.executorId);
                                this.formExecutors.get("executorName")?.setValue(value);
                            });
                    });

                // Получаем приоритеты задач для выбора, чтобы подставить ранее сохраненый приоритет.
                (await this._projectManagmentService.getTaskPrioritiesAsync())
                    .subscribe(async _ => {
                        console.log("Приоритеты задачи для выбора: ", this.priorities$.value);

                        // Записываем текущий приоритет задачи в выпадающий список.
                        let value = this.priorities$.value.find((st: any) => st.priorityId == this.taskDetails$.value.priorityId);
                        this.formPriorities.get("priorityName")?.setValue(value);

                        // Получаем приоритеты задач для выбора, чтобы подставить ранее сохраненый приоритет.
                        (await this._projectManagmentService.getTaskPrioritiesAsync())
                            .subscribe(_ => {
                                console.log("Приоритеты задачи для выбора: ", this.priorities$.value);

                                // Записываем текущий приоритет задачи в выпадающий список.
                                let value = this.priorities$.value.find((st: any) => st.priorityId == this.taskDetails$.value.priorityId);
                                this.formPriorities.get("priorityName")?.setValue(value);
                            });
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
                            .subscribe(async _ => {
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

    /**
     * Функция обновляет приоритет задачи.
     */
    public async onChangeTaskPriorityAsync() {
        let taskPriorityInput = new TaskPriorityInput();
        taskPriorityInput.projectId = +this.projectId;
        taskPriorityInput.projectTaskId = +this.projectTaskId;
        taskPriorityInput.priorityId = this.selectedPriority.priorityId;

         (await this._projectManagmentService.updateTaskPriorityAsync(taskPriorityInput))
             .subscribe(async _ => {
                 await this.getProjectTaskDetailsAsync();
             });
    };

    /**
     * Функция обновляет исполнителя задачи.
     */
    public async onChangeTaskExecutorAsync() {
        let projectTaskExecutorInput = new ProjectTaskExecutorInput();
        projectTaskExecutorInput.projectId = +this.projectId;
        projectTaskExecutorInput.projectTaskId = +this.projectTaskId;
        projectTaskExecutorInput.executorId = this.selectedExecutor.userId;

        (await this._projectManagmentService.changeTaskExecutorAsync(projectTaskExecutorInput))
             .subscribe(async _ => {
                 await this.getProjectTaskDetailsAsync();
             });
    };

      /**
     * Функция отвязывает наблюдателя задачи.
     * @param removedValue - Удаляемое значение.
     * @param i - Индекс.
     */
       public async onDetachTaskWatcherAsync(removedValue: string, i: number) {
        let projectTaskTagInput = new ProjectTaskWatcherInput();
        projectTaskTagInput.projectId = +this.projectId;
        projectTaskTagInput.projectTaskId = +this.projectTaskId;
        projectTaskTagInput.watcherId = this.taskPeople$.value[i].userId;

        (await this._projectManagmentService.detachTaskWatcherAsync(projectTaskTagInput))
        .subscribe(async _ => {
            await this.getProjectTaskDetailsAsync();
        });
    };

    /**
    * Функция привязывает наблюдателя задачи.
    */
    public async onAttachTaskWatcherAsync() {
        let projectTaskExecutorInput = new ProjectTaskWatcherInput();
        projectTaskExecutorInput.projectId = +this.projectId;
        projectTaskExecutorInput.projectTaskId = +this.projectTaskId;
        projectTaskExecutorInput.watcherId = this.selectedWatcher.userId;

        (await this._projectManagmentService.attachTaskWatcherAsync(projectTaskExecutorInput))
             .subscribe(async _ => {
                 await this.getProjectTaskDetailsAsync();
             });
    };

     /**
    * Функция получает связи задачи (обычные связи).
    */
      private async getTaskLinkDefaultAsync() {
        (await this._projectManagmentService.getTaskLinkDefaultAsync(+this.projectId, +this.projectTaskId))
             .subscribe(_ => {
                console.log("Связанные задачи (обычная связь): ", this.taskLinkDefault$.value);
             });
    };

    /**
    * Функция получает связи задачи (родительские связи).
    */
     private async getTaskLinkParentAsync() {
        (await this._projectManagmentService.getTaskLinkParentAsync(+this.projectId, +this.projectTaskId))
             .subscribe(_ => {
                console.log("Связанные задачи (родительская связь): ", this.taskLinkParent$.value);
             });
    };

    /**
     * Функция создает связь с задачей (тип связь выбирается в выпадающем списке).
     * @returns 
     */
    public async onCreateTaskLinkAsync() {
        if (!this.selectedLinkType) {
            return;
        }

        let taskLinkInput = new TaskLinkInput();
        taskLinkInput.projectId = +this.projectId;
        taskLinkInput.taskFromLink = +this.projectTaskId;
        taskLinkInput.taskToLink = this.selectedTaskLink.taskId;
        taskLinkInput.linkType = this.selectedTaskLink.linkType;
        
        (await this._projectManagmentService.createTaskLinkAsync(taskLinkInput))
        .subscribe(async _ => {
            // Подгружаем те связи, которые надо актуализировать в таблице связей.
            if (this.selectedLinkType.key == "Link") {
                await this.getTaskLinkDefaultAsync();
            }

            if (this.selectedLinkType.key == "Parent") {
                await this.getTaskLinkParentAsync();
            }
            
            this.isVisibleCreateTaskLink = false;
         });
    };

    /**
     * Функция получает типы связей задач.
     */
     private async getLinkTypesAsync() {
        (await this._projectManagmentService.getLinkTypesAsync())
        .subscribe(_ => {
           console.log("Типы связей: ", this.linkTypes$.value);
        });
    };

     /**
     * Функция получает задачи проекта, которые доступны для создания связи с текущей задачей (разных типов связей).
     * Под текущей задачей понимается задача, которую просматривает пользователь.
     * @param linkType - Тип связи.
     */
      public async onGetAvailableTaskLinkAsync() {
        (await this._projectManagmentService.getAvailableTaskLinkAsync(+this.projectId, this.selectedLinkType.key))
        .subscribe(_ => {
           console.log("Задачи доступные для связи: ", this.linkTasks$.value);
        });
    };

    public async onSelectCreateTaskLinkAsync() {
        this.isVisibleCreateTaskLink = true;
        await this.getLinkTypesAsync();
    };
}