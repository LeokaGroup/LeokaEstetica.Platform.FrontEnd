import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { UntypedFormControl, UntypedFormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { catchError, firstValueFrom, forkJoin, tap } from "rxjs";
import { ProjectManagmentService } from "../../../services/project-managment.service";
import { ChangeTaskDetailsInput } from "../../models/input/change-task-details-input";
import { ChangeTaskNameInput } from "../../models/input/change-task-name-input";
import { ChangeTaskStatusInput } from "../../models/input/change-task-status-input";
import { ProjectTaskExecutorInput } from "../../models/input/project-task-executor-input";
import { ProjectTaskFileInput } from "../../models/input/project-task-file-input";
import { ProjectTaskTagInput } from "../../models/input/project-task-tag-input";
import { ProjectTaskWatcherInput } from "../../models/input/project-task-watcher-input";
import { TaskLinkInput } from "../../models/input/task-link-input";
import { TaskPriorityInput } from "../../models/input/task-priority-input";
import {TaskCommentInput} from "../../models/input/task-comment-input";
import {TaskCommentExtendedInput} from "../../models/input/task-comment-extended-input";
import {IncludeTaskEpicInput} from "../../models/input/include-task-epic-input";
import {UpdateTaskSprintInput} from "../../models/input/update-task-sprint-input";
import {SearchAgileObjectTypeEnum} from "../../../../enums/search-agile-object-type-enum";
import { TaskDetailTypeEnum } from "src/app/modules/enums/task-detail-type";
import { MessageService } from "primeng/api";
import {ExcludeTaskInput} from "../../../models/input/exclude-task-input";
import { EditorInitEvent, EditorTextChangeEvent } from "primeng/editor";

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
              private readonly _messageService: MessageService,
              private ref: ChangeDetectorRef,
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
    public readonly taskLinkChild$ = this._projectManagmentService.taskLinkChild$;
    public readonly taskLinkDepend$ = this._projectManagmentService.taskLinkDepend$;
    public readonly taskLinkBlocked$ = this._projectManagmentService.taskLinkBlocked$;
    public readonly linkTypes$ = this._projectManagmentService.linkTypes$;
    public readonly linkTasks$ = this._projectManagmentService.linkTasks$;
    public readonly taskFiles$ = this._projectManagmentService.taskFiles$;
    public readonly downloadFile$ = this._projectManagmentService.downloadFile$;
    public readonly taskComments$ = this._projectManagmentService.taskComments$;
    public readonly availableEpics$ = this._projectManagmentService.availableEpics$;
    public readonly epics$ = this._projectManagmentService.epics$;
    public readonly includeEpic$ = this._projectManagmentService.includeEpic$;
    public readonly sprintTask$ = this._projectManagmentService.sprintTask$;
    public readonly epicTasks$ = this._projectManagmentService.epicTasks$;

    projectId: any;
    projectTaskId: any;
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
    companyId: number = 0;
    isCommentExist = false;
    commentEditor: any;

  // TODO: Перенести все это на бэк.
    aAvailableActions: any[] = [
      {
        id: "Link",
        label: 'Связи',
        items: [{
          label: 'Добавить связь',
          icon: 'pi pi-plus',
          command: async () => {
            await this.onSelectCreateTaskLinkAsync();
          },
          visible: true
        }],
        visible: true
      },
      {
        id: "Action",
        label: 'Действия над задачей',
        items: [{
          label: 'Удалить задачу',
          icon: 'pi pi-times',
          command: async () => {
            await this.checkUserRolesAsync("ProjectRemoveTask");

            if (!this.isNotRoles) {
              await this.onRemoveProjectTaskAsync();
            }
          },
          visible: true
        }],
        visible: true
      },
    ];

    formStatuses: UntypedFormGroup = new UntypedFormGroup({
        "statusName": new UntypedFormControl("", [
            Validators.required
        ])
    });

    formPriorities: UntypedFormGroup = new UntypedFormGroup({
        "priorityName": new UntypedFormControl("", [
            Validators.required
        ])
    });

    formExecutors: UntypedFormGroup = new UntypedFormGroup({
        "executorName": new UntypedFormControl("", [
            Validators.required
        ])
    });

    formEpic: UntypedFormGroup = new UntypedFormGroup({
      "epicName": new UntypedFormControl(null)
    });

    get epicName() {
      return this.formEpic.get('epicName')?.value;
    }

    set epicName(value: any) {
      this.formEpic.get('epicName')?.setValue(value);
    }

  formSprint: UntypedFormGroup = new UntypedFormGroup({
    "sprintName": new UntypedFormControl("", [
      Validators.required
    ])
  });

    taskFormData = new FormData();
    uploadedFiles: any[] = [];
    comment: string = "";
    isActiveTaskComment: boolean = false;
    selectedEpic: any;
    selectedSprint: any;
    taskTypeId: number = +localStorage["t_t_i"];
    aSearchTasks: any[] = [];
    isSearchByTaskId: boolean = false;
    isSearchByTaskName: boolean = false;
    isSearchByTaskDescription: boolean = false;
    selectedTask: any;
    // массив тасок для добавления при сохранении эпика
    toAddEpicTasks: any[] = [];
    // массив тасок для отображения
    allEpicTasks: any[] = [];
    isNotRoles: boolean = false;
    aUserRoles: any[] = [];
    isNotRolesAccessModal: boolean = false;
    aRemovedTasks: any[] = [];

  public async ngOnInit() {
    this.initData();
  }

  async initData() {
    firstValueFrom(forkJoin([
      this.checkUrlParams(),
      await this.getUserRolesAsync(),
      await this.getProjectTaskDetailsAsync(),
      await this.getProjectTagsAsync(),
      await this.getTaskLinkDefaultAsync(),
      await this.getTaskLinkParentAsync(),
      await this.getTaskLinkChildAsync(),
      await this.getTaskLinkDependAsync(),
      await this.getTaskLinkBlockedAsync(),
      await this.getTaskFilesAsync(),
      await this.getTaskCommentsAsync(),
      await this.getAvailableSprintsAsync()
    ]));
  }

  private async checkUrlParams() {
    this._activatedRoute.queryParams
      .subscribe(async params => {
        console.log("params: ", params);

        this.projectId = params["projectId"];
        this.projectTaskId = params["taskId"];
        this.companyId = params["companyId"];
      });
  };

    /**
    * Функция получает детали задачи по ее Id.
    * @returns - Детали задачи.
    */
    private async getProjectTaskDetailsAsync() {
      (await this._projectManagmentService.getTaskDetailsByTaskIdAsync(+this.projectId, this.projectTaskId, TaskDetailTypeEnum[localStorage["t_t_i"]]))
        .pipe(
          tap( async (v: any) => {
            // заполнение массива тасок для эпика
            if (v.hasOwnProperty('epicTasks')) this.allEpicTasks = [...v.epicTasks];
          })
        )
        .subscribe(async _ => {
          console.log("Детали задачи: ", this.taskDetails$.value);

          // Нет доступа к просмотру задачи.
          if (!this.taskDetails$.value.isAccess) {
            this._router.navigate(["/forbidden"]);
            return;
          }

          // Скрываем возможные действия, которые нужно исключить.
          if (![1, 3].includes(this.taskDetails$.value.taskTypeId)) {
            this.aAvailableActions.forEach(x => {
              if (x.id == "Link") {
                x.visible = false;
              }
            });
          }

          (await this._projectManagmentService.getAvailableEpicsAsync(+this.projectId))
            .subscribe(_ => {
              console.log("Доступные эпики: ", this.availableEpics$.value);

              this.epicName = this.availableEpics$.value.find(
                (ep: any) => ep.epicId == this.taskDetails$.value.epicId
              );
            });

          let taskType = TaskDetailTypeEnum[localStorage["t_t_i"]];

          // Получаем статусы задач для выбора, чтобы подставить ранее сохраненый статус.
          (await this._projectManagmentService.getAvailableTaskStatusTransitionsAsync(this.projectId, this.projectTaskId, taskType))
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

          // Для истории (2) и эпика (4) приоритеты не грузим.
          if (this.taskTypeId != 2 && this.taskTypeId != 4) {
          // Получаем приоритеты задач для выбора, чтобы подставить ранее сохраненый приоритет.
          (await this._projectManagmentService.getTaskPrioritiesAsync())
            .subscribe(async _ => {
              console.log("Приоритеты задачи для выбора: ", this.priorities$.value);

              // Записываем текущий приоритет задачи в выпадающий список.
              let value = this.priorities$.value.find((st: any) => st.priorityId == this.taskDetails$.value.priorityId);
              this.formPriorities.get("priorityName")?.setValue(value);
            });
          }

          // Получаем название спринта, в который входит задача.
          // Исключается спринт, в который задача уже добавлена.
          (await this._projectManagmentService.getAvailableProjectSprintsAsync(+this.projectId, this.projectTaskId))
            .subscribe(_ => {
              console.log("Доступные спринты для включения задачи: ", this.sprintTask$.value);

              let value = this.sprintTask$.value.find((sp: any) => sp.sprintId == this.taskDetails$.value.sprintId);
              this.formSprint.get("sprintName")?.setValue(value);
            });
        });

      // Если просматриваем эпик, то подгрузить задачи эпика.
      if (this.taskTypeId == 4) {
        await this.getEpicTasksAsync();
      }
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
        changeTaskStatusInput.taskDetailType = this.taskTypeId;

        (await this._projectManagmentService.changeTaskStatusAsync(changeTaskStatusInput))
            .subscribe(async _ => {
                // Получаем все статусы шаблона проекта.
                (await this._projectManagmentService.getTaskStatusesAsync(this.projectId))
                    .subscribe(async _ => {
                        console.log("Статусы для выбора: ", this.taskStatuses$.value);

                      let taskType = TaskDetailTypeEnum[localStorage["t_t_i"]];

                        // Получаем статусы задач для выбора, чтобы подставить ранее сохраненый статус.
                        (await this._projectManagmentService.getAvailableTaskStatusTransitionsAsync(this.projectId, this.projectTaskId, taskType))
                            .subscribe(async _ => {
                                console.log("Возможные переходы статусов задачи: ", this.availableTransitions$.value);

                                let value = this.availableTransitions$.value.find((st: any) => st.taskStatusId == this.selectedStatus.taskStatusId);
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
    public async onSaveTaskDetailsAsync() {
      this.isActiveTaskDetails = false;

      const modelInput: ChangeTaskDetailsInput = {
        projectId: this.projectId,
        taskId: this.projectTaskId,
        changedTaskDetails: this.taskDetails,
      };

      (await this._projectManagmentService.saveTaskDetailsAsync( modelInput )).subscribe();
    };

    /**
  * Функция получает теги проекта для выбора.
  * @returns - Список тегов.
  */
    private async getProjectTagsAsync() {
        (await this._projectManagmentService.getProjectTagsAsync(this.projectId))
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
        // Проверка на отсутствие дубликатов тегов
        let isDublicate = this.taskDetails$.value.tagIds.find((item: any) => item === this.selectedTag.tagId);

        if(isDublicate === undefined){
        let projectTaskTagInput = new ProjectTaskTagInput();
        projectTaskTagInput.projectId = +this.projectId;
        projectTaskTagInput.projectTaskId = this.projectTaskId;
        projectTaskTagInput.tagId = this.selectedTag.tagId;

        (await this._projectManagmentService.attachTaskTagAsync(projectTaskTagInput))
            .subscribe(async _ => {
                await this.getProjectTaskDetailsAsync();
            });
        };
    };
    /**
    * Функция привязывает тег к задаче проекта.
    * Выбор происходит из набора тегов проекта.
    * @param removedValue - Название тега.
    */
     public async onDetachTaskTagAsync(removedValue: string) {
        let projectTaskTagInput = new ProjectTaskTagInput();
        projectTaskTagInput.projectId = +this.projectId;
        projectTaskTagInput.projectTaskId = this.projectTaskId;
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
        taskPriorityInput.projectTaskId = this.projectTaskId;
        taskPriorityInput.priorityId = this.selectedPriority.priorityId;

         (await this._projectManagmentService.updateTaskPriorityAsync(taskPriorityInput))
             .subscribe(async _ => {
                 await this.getProjectTaskDetailsAsync();
             });
    };

    /**
     * TODO: Эта логика дублируется.
     * Функция обновляет исполнителя задачи.
     */
    public async onChangeTaskExecutorAsync() {
        let projectTaskExecutorInput = new ProjectTaskExecutorInput();
        projectTaskExecutorInput.projectId = +this.projectId;
        projectTaskExecutorInput.projectTaskId = this.projectTaskId;
        projectTaskExecutorInput.executorId = this.selectedExecutor.userId;

        (await this._projectManagmentService.changeTaskExecutorAsync(projectTaskExecutorInput))
             .subscribe(async _ => {
                 await this.getProjectTaskDetailsAsync();
             });
    };

      /**
       * TODO: Эта логика дублируется.
     * Функция отвязывает наблюдателя задачи.
     * @param removedValue - Удаляемое значение.
     * @param i - Индекс.
     */
       public async onDetachTaskWatcherAsync(i: number) {
        let projectTaskTagInput = new ProjectTaskWatcherInput();
        projectTaskTagInput.projectId = Number(this.projectId);
        projectTaskTagInput.projectTaskId = Number(this.projectTaskId);
        projectTaskTagInput.watcherId = this.taskDetails$.value.watcherIds[i];

        (await this._projectManagmentService.detachTaskWatcherAsync(projectTaskTagInput))
        .subscribe(async _ => {
            await this.getProjectTaskDetailsAsync();
        });
    };

    /**
     * TODO: Эта логика дублируется.
    * Функция привязывает наблюдателя задачи.
    */
    public async onAttachTaskWatcherAsync() {
        let projectTaskExecutorInput = new ProjectTaskWatcherInput();
        projectTaskExecutorInput.projectId = +this.projectId;
        projectTaskExecutorInput.projectTaskId = this.projectTaskId;
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
       if (TaskDetailTypeEnum[localStorage["t_t_i"]] == TaskDetailTypeEnum.Task.toString()
         || TaskDetailTypeEnum[localStorage["t_t_i"]] == TaskDetailTypeEnum.Error.toString()) {
         (await this._projectManagmentService.getTaskLinkDefaultAsync(+this.projectId, this.projectTaskId))
           .subscribe(_ => {
             console.log("Связанные задачи (обычная связь): ", this.taskLinkDefault$.value);
           });
       }
    };

    /**
    * Функция получает связи задачи (родительские связи).
    */
    private async getTaskLinkParentAsync() {
      if (TaskDetailTypeEnum[localStorage["t_t_i"]] == TaskDetailTypeEnum.Task.toString()
        || TaskDetailTypeEnum[localStorage["t_t_i"]] == TaskDetailTypeEnum.Error.toString()) {
        (await this._projectManagmentService.getTaskLinkParentAsync(+this.projectId, this.projectTaskId))
          .subscribe(_ => {
            console.log("Связанные задачи (родительская связь): ", this.taskLinkParent$.value);
          });
      }
    };

     /**
    * Функция получает связи задачи (дочерние связи).
    */
      private async getTaskLinkChildAsync() {
       if (TaskDetailTypeEnum[localStorage["t_t_i"]] == TaskDetailTypeEnum.Task.toString()
         || TaskDetailTypeEnum[localStorage["t_t_i"]] == TaskDetailTypeEnum.Error.toString()) {
         (await this._projectManagmentService.getTaskLinkChildAsync(+this.projectId, this.projectTaskId))
           .subscribe(_ => {
             console.log("Связанные задачи (дочерняя связь): ", this.taskLinkChild$.value);
           });
       }
    };

     /**
    * Функция получает связи задачи (связь зависит от).
    */
      private async getTaskLinkDependAsync() {
       if (TaskDetailTypeEnum[localStorage["t_t_i"]] == TaskDetailTypeEnum.Task.toString()
         || TaskDetailTypeEnum[localStorage["t_t_i"]] == TaskDetailTypeEnum.Error.toString()) {
         (await this._projectManagmentService.getTaskLinkDependAsync(+this.projectId, this.projectTaskId))
           .subscribe(_ => {
             console.log("Связанные задачи (связь зависит от): ", this.taskLinkDepend$.value);
           });
       }
    };

     /**
    * Функция получает связи задачи (связь блокирует).
    */
      private async getTaskLinkBlockedAsync() {
       if (TaskDetailTypeEnum[localStorage["t_t_i"]] == TaskDetailTypeEnum.Task.toString()
         || TaskDetailTypeEnum[localStorage["t_t_i"]] == TaskDetailTypeEnum.Error.toString()) {
         (await this._projectManagmentService.getTaskLinkBlockedAsync(+this.projectId, this.projectTaskId))
           .subscribe(_ => {
             console.log("Связанные задачи (связь блокирует): ", this.taskLinkBlocked$.value);
           });
       }
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
        taskLinkInput.taskFromLink = this.projectTaskId;
        taskLinkInput.taskToLink = this.selectedTaskLink.fullTaskId;
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

            if (this.selectedLinkType.key == "Child") {
                await this.getTaskLinkChildAsync();
            }

            if (this.selectedLinkType.key == "Depend") {
                await this.getTaskLinkDependAsync();
                await this.getTaskLinkBlockedAsync();
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

    /**
     * Функция выбирает файл.
     * @param event - Событие.
     */
    public onSelectTaskFiles(event: any) {
        for(let file of event.files) {
            this.taskFormData.append("formCollection", file);
        }
    };

    /**
     * Функция добавляет файл к задаче.
     */
    public async onUploadTaskFilesAsync() {
        let inputModel = new ProjectTaskFileInput();
        inputModel.projectId = this.projectId;
        inputModel.taskId = this.projectTaskId;

        this.taskFormData.append("projectTaskFileInput", JSON.stringify(inputModel));

        (await this._projectManagmentService.uploadTaskFilesAsync(this.taskFormData))
             .subscribe(async _ => {
                await this.getTaskFilesAsync();
             });
    };

    /**
     * Функция удаляет связь с задачей определенного типа.
     * @param removedLinkId - Id задачи, с которой разорвать связь.
     * @param linkType - Тип связи.
     */
    public async onRemoveTaskLinkAsync(removedLinkId: number, linkType: string) {
        (await this._projectManagmentService.removeTaskLinkAsync(removedLinkId, linkType, this.projectTaskId, +this.projectId))
             .subscribe(async _ => {
                  // Подгружаем те связи, которые надо актуализировать в таблице связей.
            if (linkType == "Link") {
                await this.getTaskLinkDefaultAsync();
            }

            if (linkType == "Parent") {
                await this.getTaskLinkParentAsync();
            }

            if (linkType == "Child") {
                await this.getTaskLinkChildAsync();
            }

            if (linkType == "Depend") {
                await this.getTaskLinkDependAsync();
                await this.getTaskLinkBlockedAsync();
            }
             });
    };

    /**
     * Функция получает файлы задачи.
     */
    private async getTaskFilesAsync() {
        (await this._projectManagmentService.getTaskFilesAsync(+this.projectId, this.projectTaskId, localStorage["t_t_i"]))
        .subscribe(_ => {
           console.log("Файлы задачи: ", this.taskFiles$.value);
        });
    };

    /**
     * Функция скачивает файл.
     * @param documentId - Id документа.
     * @param documentName - Название документа.
     * @returns - Скачанный файл.
     */
    public async onDownloadFileAsync(documentId: number, documentName: string) {
        return new Promise(async resolve => {
            (await this._projectManagmentService.downloadFileAsync(documentId, +this.projectId, this.projectTaskId))
            .subscribe((_) => {
               console.log("Скачивается файл: ", this.downloadFile$.value);

                const a = document.createElement('a');
                a.setAttribute('type', 'hidden');
                a.href = URL.createObjectURL(this.downloadFile$.value.body);
                a.download = documentName;
                a.click();
                a.remove();

                resolve(this.downloadFile$.value);
            });
        })
    };

    /**
     * Функция удаляет файл задачи.
      * @param documentId - Id документа.
     */
    public async onRemoveTaskFileAsync(mongoDocumentId: string) {
        (await this._projectManagmentService.removeTaskFileAsync(mongoDocumentId))
        .subscribe(async (_: any) => {
            await this.getTaskFilesAsync();
        });
    };

    /**
     * Функция выполняет переход на задачу.
     * @param fullTaskId - Id задачи.
     */
    public async onSelectTaskLink(taskId: string) {
      let projectId = this.projectId;
      let companyId: number = this._projectManagmentService.companyId;

      await this._router.navigate([], { queryParams: { projectId, taskId, companyId } });
      localStorage["t_t_i"] = undefined; // taskTypeId;
      this.initData();
      window.scrollTo(0, 0);
    }

  /**
   * Функция создает комментарий к задаче.
   * @param comment - Комментарий.
   */
  public async onCreateTaskCommentAsync() {
    if (!this.comment) {
      return;
    }

    let taskCommentInput = new TaskCommentInput();
    taskCommentInput.comment = this.comment;
    taskCommentInput.projectId = +this.projectId;
    taskCommentInput.projectTaskId = this.projectTaskId;

    (await this._projectManagmentService.createTaskCommentAsync(taskCommentInput))
      .subscribe(async (_: any) => {
        await this.getTaskCommentsAsync();
        this.resetComment();
      });
  };

  /**
   * Функция получает список комментариев задачи.
   */
  private async getTaskCommentsAsync() {
    (await this._projectManagmentService.getTaskCommentsAsync(this.projectTaskId, +this.projectId))
      .subscribe(async (_: any) => {
        console.log("Комментарии задачи: ", this.taskComments$.value);
        this.ref.detectChanges();
      });
  };

  public async onUpdateTaskCommentAsync(commentId: number, comment: string) {
    let taskCommentExtendedInput = new TaskCommentExtendedInput();
    taskCommentExtendedInput.comment = comment;
    taskCommentExtendedInput.projectId = +this.projectId;
    taskCommentExtendedInput.projectTaskId = this.projectTaskId;
    taskCommentExtendedInput.commentId = commentId;

    (await this._projectManagmentService.updateTaskCommentAsync(taskCommentExtendedInput))
      .subscribe(async (_: any) => {
        await this.getTaskCommentsAsync();
      });
  };

  public async onDeleteTaskCommentAsync(commentId: number) {
    (await this._projectManagmentService.deleteTaskCommentAsync(commentId))
      .subscribe(async (_: any) => {
        await this.getTaskCommentsAsync();
      });
  };

  /**
   * Функция получает эпики, доступные к добавлению в них задачи.
   * @param projectId - Id проекта.
   */
  public async onGetAvailableEpicsAsync() {
    (await this._projectManagmentService.getAvailableEpicsAsync(+this.projectId))
      .subscribe(async (_: any) => {
        console.log("Доступные эпики: ", this.availableEpics$.value);
      });
  };

  /**
   * Функция добавляет задачу в эпик и подтягивает эпик, в который включена задача.
   */
  async onChangeAvailableEpicsAsync() {
    const data: IncludeTaskEpicInput = {
      epicId: `${this.epicName.epicId}`,
      projectTaskIds: [ this.projectTaskId ],
      projectId: this.projectId,
    };

    (await this._projectManagmentService.includeTaskEpicAsync(data))
      .pipe(
        catchError(async (e) => {
          console.log("(onChangeAvailableEpicsAsync) Ошибка добавления в эпик: ", e)
        })
      )
      .subscribe(async (res) => {
        if (res) {
          console.log("Добавили задачу в эпик: ", this.includeEpic$.value);
          // TODO: убрать
          // this.epicName = this.availableEpics$.value.find((ep: any) => ep.epicId == this.epicName.epicId);
        }
      });
  };

  private async getAvailableSprintsAsync() {
    (await this._projectManagmentService.getAvailableProjectSprintsAsync(+this.projectId, this.projectTaskId))
      .subscribe(_ => {
        console.log("Доступные спринты для включения задачи: ", this.sprintTask$.value);
      });
  };

  /**
   * Функция обновляет спринт, в который входит задача.
   * @param sprintId - Id спринта, на который обновить.
   */
  public async onChangeAvailableSprintsAsync(sprintId: number) {
    let updateTaskSprintInput = new UpdateTaskSprintInput();
    updateTaskSprintInput.sprintId = sprintId;
    updateTaskSprintInput.projectTaskId = this.projectTaskId;

    (await this._projectManagmentService.updateTaskSprintAsync(updateTaskSprintInput))
      .subscribe(async _ => {
        await this.getProjectTaskDetailsAsync();
      });
  };

  public onRouteEpic() {
    let epicId = this.selectedEpic.epicId;
    let projectId = this.projectId;

    this._router.navigate(["/project-management/space/epic"], {
      queryParams: {
        projectId,
        epicId
      }
    });
  };

  /**
   * Функция выполняет переход на спринт.
   */
  onRouteSprint() {
    let projectId = this.projectId;
    let projectSprintId = this.selectedSprint.projectSprintId;

    this._router.navigate(["/project-management/sprints/sprint/details"], {
      queryParams: {
        projectId,
        projectSprintId
      }
    });
  };

  /**
   * Функция получает задачи эпика.
   */
  private async getEpicTasksAsync() {
    (await this._projectManagmentService.getEpicTasksAsync(this.projectId, +this.projectTaskId))
      .subscribe(async (_: any) => {
        console.log("Задачи эпика: ", this.epicTasks$.value);
        this.allEpicTasks = this.epicTasks$.value.epicTasks;
      });
  };

  /**
   * Функция исключает задачу из эпика.
   * @param projectTaskId - Id задачи в рамках проекта.
   */
  public async onRemoveEpicTaskAsync(event: any) {
    let projectTaskId = event.projectTaskId;

    // Не дергаем бэк лишний раз, если не добавляли задачи для удаления.
    if (projectTaskId == 0) {
      return;
    }

    this.toAddEpicTasks = [...this.toAddEpicTasks.filter(v => v.projectTaskId != projectTaskId)];
    this.aRemovedTasks.push(this.allEpicTasks.filter(v => v.projectTaskId == projectTaskId));
    this.allEpicTasks = [...this.allEpicTasks.filter(v => v.projectTaskId != projectTaskId)];

    if (this.aRemovedTasks.length == 0) {
      return;
    }

    let excludeTaskInput = new ExcludeTaskInput();
    excludeTaskInput.epicSprintId = this.taskDetails$.value.projectTaskId;

    this.aRemovedTasks.forEach((x: any) => {
      excludeTaskInput.projectTaskIds.push(x[0].projectTaskId);
    });

    (await this._projectManagmentService.removeEpicTasksAsync(excludeTaskInput))
      .subscribe(_ => {
        // После удаления задач очищаем этот список.
        this.aRemovedTasks = [];
      });
  };

  /**
   * Функция находит задачи, истории для добавления их в эпик.
   * @param event - Ивент события.
   */
  public async onSearchIncludeEpicTaskAsync(event: any) {
    (await this._projectManagmentService.searchAgileObjectAsync(
      event.query, this.isSearchByTaskId, this.isSearchByTaskName, this.isSearchByTaskDescription,
      this.projectId, SearchAgileObjectTypeEnum.Epic))
      .subscribe(_ => {
        console.log("Задачи для добавления в эпик", this.epicTasks$.value);
      });
  };

  /**
   * Функция включает задачу в эпик.
   */
  public async onIncludeEpicTaskAsync() {
    this.allEpicTasks = [...this.allEpicTasks, this.selectedTask];
    this.toAddEpicTasks = [...this.toAddEpicTasks, this.selectedTask];

    // Не дергаем бэк лишний раз, если не добавляли задачи для включения их в эпик.
    if (this.toAddEpicTasks.length == 0) {
      return;
    }

    let includeTaskEpicInput = new IncludeTaskEpicInput();
    includeTaskEpicInput.epicId = this.projectTaskId;
    includeTaskEpicInput.projectTaskIds = this.toAddEpicTasks.map(x => x.fullProjectTaskId);
    includeTaskEpicInput.projectId = +this.projectId;

    (await this._projectManagmentService.includeTaskEpicAsync(includeTaskEpicInput))
      .subscribe(_ => {
        console.log("Включили задачу в эпик: ", this.includeEpic$.value);
      });
  };

  public onClosePanelMenu() {
    this._projectManagmentService.isLeftPanel = false;
  };

  public onSelectPanelMenu() {
    this._projectManagmentService.isLeftPanel = true;
  };

  /**
   * Функция удаляет задачу.
   * @param projectId - Id проекта.
   * @param projectTaskId - Id задачи в рамках проекта.
   */
  private async onRemoveProjectTaskAsync() {
    (await this._projectManagmentService.removeProjectTaskAsync(+this.projectId, this.projectTaskId, TaskDetailTypeEnum[localStorage["t_t_i"]]))
      .subscribe(_ => {
        let projectId = this.projectId;

        setTimeout(() => {
          this._router.navigate(["/project-management/space"], {
            queryParams: {
              projectId
            }
          });
        }, 4000);
      });
  };

  // TODO: dead code - remove?
  // public onHandleComment(comment: string) {
  //   console.log("onHandleComment", comment);
  //   this.comment = comment;
  // };

  /**
   * Функция получает роли пользователя.
   */
  private async getUserRolesAsync() {
    (await this._projectManagmentService.getUserRolesAsync(+this.projectId, +this.companyId))
      .subscribe((response: any) => {
        console.log("Роли пользователя", response);
        this.aUserRoles = response;
      });
  };

  /**
   * Функция проверяет роли пользователя.
   * @param role - Роль для проверки.
   */
  private async checkUserRolesAsync(role: string | null = null): Promise<boolean> {
    if (this.aUserRoles.find((x: any) => x.roleSysName == role).isEnabled) {
      this.isNotRoles = false;
      this.isNotRolesAccessModal = false;

      return this.isNotRoles;
    }

    this.isNotRoles = true;
    this.isNotRolesAccessModal = true;

    return this.isNotRoles;
  };

  /**
   * Функция для вызова detectChanges при начале редактирования комментария.
   * @param $event - эвент редактора.
   */
  onCommentChange($event: EditorTextChangeEvent) {
    const hasText = $event.textValue != '';
    if (this.isCommentExist != hasText) {
      this.isCommentExist = hasText;
      this.ref.detectChanges();
    }
  }

  /**
   * Функция получения ссылки на root элемент редактора комментария.
   * @param $event - эвент редактора.
   */
  onCommentInit($event: EditorInitEvent){
    this.commentEditor = $event.editor.root;
  }

  /**
   * Функция очистки текста комментария.
   */
  resetComment() {
    this.comment = '';
    if (this.commentEditor) {
      this.isCommentExist = false;
      this.commentEditor.innerHTML = '<p></p>';
    }
  }
}
