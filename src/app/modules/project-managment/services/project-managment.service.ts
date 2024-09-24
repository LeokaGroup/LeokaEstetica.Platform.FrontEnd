import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BehaviorSubject, tap} from 'rxjs';
import {API_URL} from 'src/app/core/core-urls/api-urls';
import {ChangeTaskDetailsInput} from '../task/models/input/change-task-details-input';
import {ChangeTaskNameInput} from '../task/models/input/change-task-name-input';
import {ChangeTaskStatusInput} from '../task/models/input/change-task-status-input';
import {ConfigSpaceSettingInput} from '../task/models/input/config-space-setting-input';
import {CreateProjectManagementTaskInput} from '../task/models/input/create-task-input';
import {CreateTaskStatusInput} from '../task/models/input/create-task-status-input';
import {FixationStrategyInput} from '../task/models/input/fixation-strategy-input';
import {ProjectTaskExecutorInput} from '../task/models/input/project-task-executor-input';
import {ProjectTaskTagInput} from '../task/models/input/project-task-tag-input';
import {ProjectTaskWatcherInput} from '../task/models/input/project-task-watcher-input';
import {TaskLinkInput} from '../task/models/input/task-link-input';
import {TaskPriorityInput} from '../task/models/input/task-priority-input';
import {UserTaskTagInput} from '../task/models/input/user-task-tag-input';
import {TaskCommentInput} from '../task/models/input/task-comment-input';
import {TaskCommentExtendedInput} from "../task/models/input/task-comment-extended-input";
import {IncludeTaskEpicInput} from "../task/models/input/include-task-epic-input";
import {PlaningSprintInput} from "../task/models/input/planing-sprint-input";
import {UpdateTaskSprintInput} from '../task/models/input/update-task-sprint-input';
import {SearchAgileObjectTypeEnum} from '../../enums/search-agile-object-type-enum';
import {UpdateSprintNameInput} from "../sprint/models/update-sprint-name-input";
import { UpdateSprintDetailsInput } from '../sprint/models/update-sprint-details-input';
import { UpdateSprintExecutorInput } from '../sprint/models/update-sprint-executor-input';
import { UpdateSprintWatchersInput } from '../sprint/models/update-sprint-watchers-input';
import { SprintInput } from '../sprint/models/sprint-input';
import {SprintDurationSettingInput} from "../sprint/models/sprint-duration-setting-input";
import {SprintMoveNotCompletedTaskSettingInput} from "../sprint/models/sprint-move-not-completed-task-setting-input";
import {UpdateRoleInput} from "../models/input/update-role-input";
import { UpdateFolderNameInput } from '../models/input/update-folder-name-input';
import { UpdateFolderPageNameInput } from '../models/input/update-folder-page-name-input';
import { UpdateFolderPageDescriptionInput } from '../models/input/update-folder-page-description-input';
import { CreateWikiFolderInput } from '../models/input/create-folder-input';
import {CreateWikiPageInput} from "../models/input/create-page-input";
import {ExcludeTaskInput} from "../models/input/exclude-task-input";
import {CompanyInput} from "../models/input/company-input";
import {IncludeTaskSprintInput} from "../sprint-details/models/input/include-sprint-task-input";

/**
 * Класс сервиса модуля управления проектами.
 */
@Injectable()
export class ProjectManagmentService {
    apiUrl: any;

    public availableProjectManagment$ = new BehaviorSubject<any>(null);
    public userProjects$ = new BehaviorSubject<any>(null);
    public viewStrategies$ = new BehaviorSubject<any>(null);
    public headerItems$ = new BehaviorSubject<any>(null);
    public projectManagmentTemplates$ = new BehaviorSubject<any>(null);
    public workSpaceConfig$ = new BehaviorSubject<any>(null);
    public taskDetails$ = new BehaviorSubject<any>(null);
    public priorities$ = new BehaviorSubject<any>(null);
    public taskTypes$ = new BehaviorSubject<any>(null);
    public projectTags$ = new BehaviorSubject<any>(null);
    public taskStatuses$ = new BehaviorSubject<any>(null);
    public taskExecutors$ = new BehaviorSubject<any>(null);
    public projectWorkspaceSettings$ = new BehaviorSubject<any>(null);
    public commitedProjectWorkspaceSettings$ = new BehaviorSubject<any>(null);
    public createdTask$ = new BehaviorSubject<any>(null);
    public templateStatuses$ = new BehaviorSubject<any>(null);
    public availableTransitions$ = new BehaviorSubject<any>(null);
    public taskLinkDefault$ = new BehaviorSubject<any>(null);
    public taskLinkParent$ = new BehaviorSubject<any>(null);
    public taskLinkChild$ = new BehaviorSubject<any>(null);
    public taskLinkDepend$ = new BehaviorSubject<any>(null);
    public taskLinkBlocked$ = new BehaviorSubject<any>(null);
    public linkTypes$ = new BehaviorSubject<any>(null);
    public linkTasks$ = new BehaviorSubject<any>(null);
    public taskFiles$ = new BehaviorSubject<any>(null);
    public downloadFile$ = new BehaviorSubject<any>(null);
    public taskComments$ = new BehaviorSubject<any>(null);
    public downloadUserAvatarFile$ = new BehaviorSubject<any>(null);
    public searchTasks$ = new BehaviorSubject<any>(null);
    public backlogData$ = new BehaviorSubject<any>(null);
    public availableEpics$ = new BehaviorSubject<any>(null);
    public epics$ = new BehaviorSubject<any>(null);
    public includeEpic$ = new BehaviorSubject<any>(null);
    public sprintTasks$ = new BehaviorSubject<any>(null);
    public userStoryStatuses$ = new BehaviorSubject<any>(null);
    public searchSprintTasks$ = new BehaviorSubject<any>(null);
    public sprintTask$ = new BehaviorSubject<any>(null);
    public epicTasks$ = new BehaviorSubject<any>(null);
    public sprints = new BehaviorSubject<any>(null);
    public sprintDetails$ = new BehaviorSubject<any>(null);
    public sprintDurationSettings$ = new BehaviorSubject<any>(null);
    public sprintMoveNotCompletedTasksSettings$ = new BehaviorSubject<any>(null);
    public workspaces$ = new BehaviorSubject<any>(null);
    public wikiContextMenu$ = new BehaviorSubject<any>(null);
    public selectedWorkSpace$ = new BehaviorSubject<any>(null);
    public settingUsers = new BehaviorSubject<any>(null);
    public userRoles = new BehaviorSubject<any>(null);
    public settingUserRoles = new BehaviorSubject<any>(null);
    public wikiTreeItems$ = new BehaviorSubject<any>(null);
    public wikiTreeFolderItems$ = new BehaviorSubject<any>(null);
    public wikiTreeFolderPage$ = new BehaviorSubject<any>(null);
    public removeFolderResponse$ = new BehaviorSubject<any>(null);
    public projectInvites$ = new BehaviorSubject<any>(null)
    public epicStatuses$ = new BehaviorSubject<any>(null);
    public calculateUserCompanies = new BehaviorSubject<any>(null);
    public userCompanies$ = new BehaviorSubject<any>(null);

    public isLeftPanel = false;
    public companyId: number = 0;

    constructor(private readonly _http: HttpClient) {

        // Если используем ендпоинты модуля УП.
        if (API_URL.apiUrlProjectManagment !== null && API_URL.apiUrlProjectManagment !== undefined) {
            this.apiUrl = API_URL.apiUrlProjectManagment;
        }

        // Если используем основные ендпоинты.
        else {
            this.apiUrl = API_URL.apiUrl
        }
    }

    /**
    * Функция проверяет доступность модуля УП.
    * @returns - Признак доступности модуля УП.
    */
    public async availableProjectManagmentAsync() {
        return await this._http.get(this.apiUrl + "/project-management/config/is-available-project-management").pipe(
            tap(data => this.availableProjectManagment$.next(data))
        );
    };

    /**
    * Функция получает список проектов пользователя.
    * @returns - Список проектов.
    */
    public async getUseProjectsAsync() {
        return await this._http.get(this.apiUrl + "/project-management/user-projects").pipe(
            tap(data => this.userProjects$.next(data))
        );
    };

    /**
   * Функция получает список стратегий представления.
   * @returns - Список стратегий.
   */
    public async getViewStrategiesAsync() {
        return await this._http.get(this.apiUrl + "/project-management/view-strategies").pipe(
            tap(data => this.viewStrategies$.next(data))
        );
    };

    /**
     * Функция получает список элементов меню хидера (верхнее меню).
     * @returns - Список элементов.
     */
    public async getHeaderItemsAsync() {
        return await this._http.get(this.apiUrl + "/project-management/panel").pipe(
            tap(data => this.headerItems$.next(data))
        );
    };

    /**
    * Функция получает список шаблонов со статусами для выбора пользователю
    * @returns - Список шаблонов.
    */
    public async getProjectManagmentTemplatesAsync() {
        return await this._http.get(this.apiUrl + "/project-management/templates").pipe(
            tap(data => this.projectManagmentTemplates$.next(data))
        );
    };

  /**
   * Функция получает конфигурацию рабочего пространства по выбранному шаблону.
   * Под конфигурацией понимаются основные элементы рабочего пространства (набор задач, статусов, фильтров, колонок и тд)
   * если выбранный шаблон это предполагает.
   * @param projectId - Id проекта.
   * @param paginatorStatusId - Id статуса, для которого нужно применить пагинатор.
   * Если он null, то пагинатор применится для задач всех статусов шаблона.
   * @param page - Номер страницы..
   * @returns - Данные конфигурации.
   */
  public async getConfigurationWorkSpaceBySelectedTemplateAsync(projectId: number, paginatorStatusId: number | null, page: number, type: string) {
    if (type == "Space") {
      if (paginatorStatusId == null) {
        return await this._http.get(this.apiUrl +
          `/project-management/config-workspace-template?projectId=${projectId}&modifyTaskStatuseType=Space&page=${page}`).pipe(
          tap(data => this.workSpaceConfig$.next(data))
        );
      }

      else {
        return await this._http.get(this.apiUrl +
          `/project-management/config-workspace-template?projectId=${projectId}&paginatorStatusId=${paginatorStatusId}&modifyTaskStatuseType=Space&page=${page}`).pipe(
          tap(data => this.workSpaceConfig$.next(data))
        );
      }
    }

    else if (type == "Backlog") {
      if (paginatorStatusId == null) {
        return await this._http.get(this.apiUrl +
          `/project-management/config-workspace-template?projectId=${projectId}&modifyTaskStatuseType=Backlog&page=${page}`).pipe(
          tap(data => this.backlogData$.next(data))
        );
      }

      else {
        return await this._http.get(this.apiUrl +
          `/project-management/config-workspace-template?projectId=${projectId}&paginatorStatusId=${paginatorStatusId}&modifyTaskStatuseType=Backlog&page=${page}`).pipe(
          tap(data => this.backlogData$.next(data))
        );
      }
    }

    // По дефолту вернем применив пагинатор для всех статусов.
    return await this._http.get(this.apiUrl +
      `/project-management/config-workspace-template?projectId=${projectId}&page=${page}`).pipe(
      tap(data => this.workSpaceConfig$.next(data))
    );
  };

     /**
      * Функция получает детали задачи.
      * @param projectId - Id проекта.
      * @param projectTaskId
      * @param taskDetailType
      * @returns - Данные конфигурации.
      */
      public async getTaskDetailsByTaskIdAsync(projectId: number, projectTaskId: string, taskDetailType: string) {
        return await this._http.get(this.apiUrl + `/project-management/task-details?projectTaskId=${projectTaskId}&projectId=${projectId}&taskDetailType=${taskDetailType}`).pipe(
            tap(data => this.taskDetails$.next(data))
        );
    };

     /**
    * Функция получает приоритеты задачи для выбора.
    * @returns - Приоритеты задачи.
    */
      public async getTaskPrioritiesAsync() {
        return await this._http.get(this.apiUrl + "/project-management/priorities").pipe(
            tap(data => this.priorities$.next(data))
        );
    };

     /**
    * Функция получает типы задач для выбора.
    * @returns - Типы задач.
    */
      public async getTaskTypesAsync() {
        return await this._http.get(this.apiUrl + "/project-management/task-types").pipe(
            tap(data => this.taskTypes$.next(data))
        );
    };

    /**
    * Функция получает теги проекта для выбора.
    * @returns - Список тегов.
    */
     public async getProjectTagsAsync(projectId: number) {
        return await this._http.get(this.apiUrl + `/project-management/project-tags?projectId=${projectId}`).pipe(
            tap(data => this.projectTags$.next(data))
        );
    };

    /**
    * Функция получает статусы задач для выбора.
    * Статусы выводятся в рамках шаблона.
    * @returns - Список статусов.
    */
     public async getTaskStatusesAsync(projectId: number) {
        return await this._http.get(this.apiUrl + `/project-management/task-statuses?projectId=${projectId}`).pipe(
            tap(data => this.taskStatuses$.next(data))
        );
    };

  /**
   * Функция получает статусы эпиков для выбора.
   * @returns - Список статусов.
   */
  public async getEpicStatusesAsync() {
    return await this._http.get(this.apiUrl + `/project-management/epic-statuses`).pipe(
      tap(data => this.epicStatuses$.next(data))
    );
  };

    /**
    * Функция получает исполнителей или наблюдателей для выбора.
    * @returns - Список пользователей.
    */
     public async getSelectTaskPeopleAsync(projectId: number) {
        return await this._http.get(this.apiUrl + `/project-management/select-task-people?projectId=${projectId}`).pipe(
            tap(data => this.taskExecutors$.next(data))
        );
    };

    /**
    * Функция получает исполнителей или наблюдателей для выбора.
    * @returns - Список пользователей.
    */
    public async createProjectTaskAsync(createTaskInput: CreateProjectManagementTaskInput) {
        return await this._http.post(this.apiUrl + "/project-management/task", createTaskInput).pipe(
            tap(data => this.createdTask$.next(data))
        );
    };

  /**
   * Функция получает сформированную ссылку для перехода к управлению проектом.
   * Если ее нет, то предлагаем к выбору шаблон, стратегию представления.
   * @param projectId - Id проекта.
   * @param companyId - Id компании.
   * @returns - Выходная модель.
   */
  public async getBuildProjectSpaceSettingsAsync(projectId: number | null, companyId: number | null) {
    if (projectId !== null && companyId != null) {
      return await this._http.get(this.apiUrl + `/project-management/config/build-project-space?projectId=${projectId}&companyId=${companyId}`).pipe(
        tap(data => this.projectWorkspaceSettings$.next(data))
      );
    }

    else {
      return await this._http.get(this.apiUrl + `/project-management/config/build-project-space`).pipe(
        tap(data => this.projectWorkspaceSettings$.next(data))
      );
    }
  };

    /**
    * Функция фиксирует выбранные пользователем настройки рабочего пространства проекта.
    */
     public async commitSpaceSettingsAsync(configSpaceSettingInput: ConfigSpaceSettingInput) {
        return await this._http.post(this.apiUrl + "/project-management/config/space-settings", configSpaceSettingInput).pipe(
            tap(data => this.commitedProjectWorkspaceSettings$.next(data))
        );
    };

    /**
    * Функция создает метку (тег) для задач пользователя.
    * @param userTaskTagInput - Входная модель.
    */
     public async createUserTaskTagAsync(userTaskTagInput: UserTaskTagInput) {
        return await this._http.post(this.apiUrl + "/project-management/project-tag", userTaskTagInput).pipe(
            tap(_ => console.log("Метка (тег) успешно создано"))
        );
    };

    /**
    * Функция получает статусы шаблона для определения категории при создании статуса.
    * Статусы выводятся в рамках шаблона.
    * @returns - Список статусов.
    */
     public async getProjectTemplateStatusesAsync(projectId: number) {
        return await this._http.get(this.apiUrl + `/project-management/select-create-task-statuses?projectId=${projectId}`).pipe(
            tap(data => this.templateStatuses$.next(data))
        );
    };

    /**
    * Функция создает новый статус шаблона пользователя учитывая ассоциацию статуса.
    */
     public async createUserTaskStatusTemplateAsync(createTaskStatusInput: CreateTaskStatusInput) {
        return await this._http.post(this.apiUrl + `/project-management/user-task-status`, createTaskStatusInput).pipe(
            tap(_ => console.log("Кастомный статус успешно создан"))
        );
    };

  /**
   * Функция получает доступные переходы в статусы задачи.
   * @param projectId - Id проекта.
   * @param projectTaskId - Id задачи в рамках проекта.
   * @param taskType - Тип детализации.
   * @returns - Доступные переходы.
   */
  public async getAvailableTaskStatusTransitionsAsync(projectId: number, projectTaskId: number, taskType: string) {
    return await this._http.get(this.apiUrl + `/project-management/available-task-status-transitions?projectId=${projectId}&projectTaskId=${projectTaskId}&taskDetailType=${taskType}`).pipe(
      tap(data => this.availableTransitions$.next(data))
    );
  };

    /**
    * Функция изменяет статус задачи.
    * @param changeTaskStatusInput - Входная модель.
    */
     public async changeTaskStatusAsync(changeTaskStatusInput: ChangeTaskStatusInput) {
        return await this._http.patch(this.apiUrl + `/project-management/task-status`, changeTaskStatusInput).pipe(
            tap(_ => console.log("Статус задачи успешно изменен"))
        );
    };

    /**
    * Функция сохраняет название задачи.
    * @param changeTaskNameInput - Входная модель.
    */
     public async saveTaskNameAsync(changeTaskNameInput: ChangeTaskNameInput) {
        return await this._http.patch(this.apiUrl + `/project-management/task-name`, changeTaskNameInput).pipe(
            tap(_ => console.log("Название задачи успешно изменено"))
        );
    };

    /**
    * Функция сохраняет описание задачи.
    * @param changeTaskNameInput - Входная модель.
    */
     public async saveTaskDetailsAsync(changeTaskDetailsInput: ChangeTaskDetailsInput) {
        return await this._http.patch(this.apiUrl + `/project-management/task-details`, changeTaskDetailsInput).pipe(
            tap(_ => console.log("Описание задачи успешно изменено"))
        );
    };

    /**
    * Функция привязывает тег к задаче проекта.
    * Выбор происходит из набора тегов проекта.
    * @param projectTaskTagInput - Входная модель.
    */
     public async attachTaskTagAsync(projectTaskTagInput: ProjectTaskTagInput) {
        return await this._http.patch(this.apiUrl + `/project-management/attach-task-tag`, projectTaskTagInput).pipe(
            tap(_ => console.log("Тег успешно привязан к задаче"))
        );
    };

    /**
    * Функция отвязывает тег от задачи проекта.
    * @param projectTaskTagInput - Входная модель.
    */
     public async detachTaskTagAsync(projectTaskTagInput: ProjectTaskTagInput) {
        return await this._http.patch(this.apiUrl + `/project-management/detach-task-tag`, projectTaskTagInput).pipe(
            tap(_ => console.log("Тег успешно отвязан от задачи"))
        );
    };

    /**
    * Функция обновляет приоритет задачи.
    * @param projectTaskTagInput - Входная модель.
    */
     public async updateTaskPriorityAsync(taskPriorityInput: TaskPriorityInput) {
        return await this._http.patch(this.apiUrl + `/project-management/task-priority`, taskPriorityInput).pipe(
            tap(_ => console.log("Приоритет задачи успешно изменен"))
        );
    };

    /**
    * Функция обновляет исполнителя задачи.
    * @param projectTaskExecutorInput - Входная модель.
    */
     public async changeTaskExecutorAsync(projectTaskExecutorInput: ProjectTaskExecutorInput) {
        return await this._http.patch(this.apiUrl + `/project-management/task-executor`, projectTaskExecutorInput).pipe(
            tap(_ => console.log("Исполнитель задачи успешно изменен"))
        );
    };

    /**
    * Функция привязывает наблюдателя задачи.
    * @param projectTaskWatcherInput - Входная модель.
    */
     public async attachTaskWatcherAsync(projectTaskWatcherInput: ProjectTaskWatcherInput) {
        return await this._http.patch(this.apiUrl + `/project-management/attach-task-watcher`, projectTaskWatcherInput).pipe(
            tap(_ => console.log("Наблюдатель задачи успешно привязан"))
        );
    };

     /**
    * Функция отвязывает наблюдателя от задачи проекта.
    * @param projectTaskWatcherInput - Входная модель.
    */
      public async detachTaskWatcherAsync(projectTaskWatcherInput: ProjectTaskWatcherInput) {
        return await this._http.patch(this.apiUrl + `/project-management/detach-task-watcher`, projectTaskWatcherInput).pipe(
            tap(_ => console.log("Наблюдатель успешно отвязан от задачи"))
        );
    };

     /**
    * Функция получает связи задачи (обычные связи).
    * @param projectId - Id проекта.
    * @param projectTaskId - Id задачи в рамках проекта.
    */
      public async getTaskLinkDefaultAsync(projectId: number, projectTaskId: string) {
        return await this._http.get(this.apiUrl +
            `/project-management/task-link-default?projectId=${projectId}&projectTaskId=${projectTaskId}&linkType=Link`).pipe(
            tap(data => this.taskLinkDefault$.next(data))
        );
    };

      /**
    * Функция получает связи задачи (родительские связи).
    * @param projectId - Id проекта.
    * @param projectTaskId - Id задачи в рамках проекта.
    */
       public async getTaskLinkParentAsync(projectId: number, projectTaskId: number) {
        return await this._http.get(this.apiUrl +
            `/project-management/task-link-parent?projectId=${projectId}&projectTaskId=${projectTaskId}&linkType=Parent`).pipe(
            tap(data => this.taskLinkParent$.next(data))
        );
    };

     /**
    * Функция получает связи задачи (дочерние связи).
    * @param projectId - Id проекта.
    * @param projectTaskId - Id задачи в рамках проекта.
    */
      public async getTaskLinkChildAsync(projectId: number, projectTaskId: string) {
        return await this._http.get(this.apiUrl +
            `/project-management/task-link-child?projectId=${projectId}&projectTaskId=${projectTaskId}&linkType=Child`).pipe(
            tap(data => this.taskLinkChild$.next(data))
        );
    };

     /**
    * Функция получает связи задачи (связи зависит от).
    * @param projectId - Id проекта.
    * @param projectTaskId - Id задачи в рамках проекта.
    */
      public async getTaskLinkDependAsync(projectId: number, projectTaskId: string) {
        return await this._http.get(this.apiUrl +
            `/project-management/task-link-depend?projectId=${projectId}&projectTaskId=${projectTaskId}&linkType=Depend`).pipe(
            tap(data => this.taskLinkDepend$.next(data))
        );
    };

    /**
    * Функция получает связи задачи (связи блокирует).
    * @param projectId - Id проекта.
    * @param projectTaskId - Id задачи в рамках проекта.
    */
     public async getTaskLinkBlockedAsync(projectId: number, projectTaskId: string) {
        return await this._http.get(this.apiUrl +
            `/project-management/task-link-blocked?projectId=${projectId}&projectTaskId=${projectTaskId}&linkType=Depend`).pipe(
            tap(data => this.taskLinkBlocked$.next(data))
        );
    };

      /**
    * Функция создает связь с задачей (в зависимости от типа связи, который передали).
    * @param taskLinkInput - Входная модель.
    */
       public async createTaskLinkAsync(taskLinkInput: TaskLinkInput) {
        return await this._http.post(this.apiUrl + `/project-management/task-link`, taskLinkInput).pipe(
            tap(_ => console.log("Связь успешно добавлена"))
        );
    };

     /**
     * Функция получает типы связей задач.
     */
       public async getLinkTypesAsync() {
        return await this._http.get(this.apiUrl + `/project-management/link-types`).pipe(
            tap(data => this.linkTypes$.next(data))
        );
    };

      /**
     * Функция получает задачи проекта, которые доступны для создания связи с текущей задачей (разных типов связей).
     * Под текущей задачей понимается задача, которую просматривает пользователь.
     * @param projectId - Id проекта.
     * @param linkType - Тип связи.
     */
      public async getAvailableTaskLinkAsync(projectId: number, linkType: string) {
        return await this._http.get(this.apiUrl +
            `/project-management/available-task-link?projectId=${projectId}&linkType=${linkType}`).pipe(
            tap(data => this.linkTasks$.next(data))
        );
    };

      /**
     * Функция удаляет связь с задачей определенного типа.
     * @param removedLinkId - Id задачи, с которой разорвать связь.
     * @param linkType - Тип связи.
     * @param currentTaskId - Id текущей задачи в рамках проекта.
     * @param projectId - Id проекта.
     */
    public async removeTaskLinkAsync(removedLinkId: number, linkType: string, currentTaskId: number, projectId: number) {
        return await this._http.delete(this.apiUrl +
            `/project-management/task-link?linkType=${linkType}&linkType=${linkType}&removedLinkId=${removedLinkId}&currentTaskId=${currentTaskId}&projectId=${projectId}`).pipe(
                tap(data => this.linkTasks$.next(data))
            );
    };

    /**
     * Функция добавляет файл к задаче.
     * @param formData - Данные формы.
     */
       public async uploadTaskFilesAsync(formData: FormData) {
        return await this._http.post(this.apiUrl + `/project-management/upload-task-file`, formData).pipe(
            tap(_ => console.log("Файлы успешно добавлены к задаче"))
        );
    };

     /**
     * Функция добавляет файл к задаче.
     * @param projectId - Id проекта.
     * @param projectTaskId - Id задачи в рамках проекта.
     */
      public async getTaskFilesAsync(projectId: number, projectTaskId: string, taskTypeId: number) {
        return await this._http.get(this.apiUrl + `/project-management/task-files?projectId=${projectId}&projectTaskId=${projectTaskId}&taskTypeId=${taskTypeId}`).pipe(
            tap(data => this.taskFiles$.next(data))
        );
    };

     /**
     * Функция скачивает файл задачи.
     * @param documentId - Id документа.
     * @param projectId - Id проекта.
     * @param projectTaskId - Id задачи в рамках проекта.
     */
    public async downloadFileAsync(documentId: number, projectId: number, projectTaskId: number) {
        return await this._http.get(this.apiUrl +
            `/project-management/download-task-file?documentId=${documentId}&projectId=${projectId}&projectTaskId=${projectTaskId}`,
            { observe: 'response', responseType: 'blob' }).pipe(
                tap(data => this.downloadFile$.next(data))
            );
    };

    /**
   * Функция удаляет файл задачи.
     * @param mongoDocumentId - Id документа в MongoDB.
   */
    public async removeTaskFileAsync(mongoDocumentId: string) {
        return await this._http.delete(this.apiUrl +
            `/project-management/task-file?mongoDocumentId=${mongoDocumentId}`).pipe(
            tap(_ => console.log("Файл задачи успешно удален"))
        );
    };

  /**
   * Функция фиксирует выбранную пользователем стратегию представления.
   * @param strategySysName - Системное название выбранной стратегии представления.
   * @param projectId - Id проекта.
   */
  public async fixationSelectedViewStrategyAsync(fixationStrategyInput: FixationStrategyInput) {
    return await this._http.patch(this.apiUrl + `/project-management-settings/fixation-strategy`, fixationStrategyInput).pipe(
      tap(_ => console.log("Стратегия зафиксирована"))
    );
  };

  /**
   * Функция создает комментарий к задаче.
   * @param taskCommentInput - Входная модель..
   */
  public async createTaskCommentAsync(taskCommentInput: TaskCommentInput) {
    return await this._http.post(this.apiUrl + `/project-management/task-comment`, taskCommentInput).pipe(
      tap(_ => console.log("Комментарий задачи создан"))
    );
  };

  /**
   * Функция получает список комментариев задачи.
   * @param projectTaskId - Id задачи в рамках проекта.
   * @param projectId - Id проекта.
   */
  public async getTaskCommentsAsync(projectTaskId: string, projectId: number) {
    return await this._http.get(this.apiUrl +
      `/project-management/task-comment?projectTaskId=${projectTaskId}&projectId=${projectId}`).pipe(
      tap(data => this.taskComments$.next(data))
    );
  };

  /**
   * Функция обновляет комментарий задачи.
   * @param taskCommentInput - Входная модель.
   */
  public async updateTaskCommentAsync(taskCommentExtendedInput: TaskCommentExtendedInput) {
    return await this._http.put(this.apiUrl + `/project-management/task-comment`, taskCommentExtendedInput).pipe(
      tap(_ => console.log("Комментарий задачи изменен"))
    );
  };

  /**
   * Функция удаляет комментарий задачи.
   * @param commentId - Id комментария.
   */
  public async deleteTaskCommentAsync(commentId: number) {
    return await this._http.delete(this.apiUrl + `/project-management/task-comment?commentId=${commentId}`).pipe(
      tap(_ => console.log("Комментарий задачи удален"))
    );
  };

  /**
   * Функция скачивает файл изображения аватара пользователя проекта.
   * @param projectId - Id проекта.
   */
  public async getFileUserAvatarAsync(projectId: number) {
    return await this._http.get(this.apiUrl +
      `/project-management-settings/user-avatar-file?projectId=${projectId}`,
      { observe: 'response', responseType: 'blob' }).pipe(
      tap(data => this.downloadUserAvatarFile$.next(data))
    );
  };

  /**
   * Функция скачивает файл изображения аватара пользователя проекта.
   * @param formData - Данные формы.
   */
  public async uploadUserAvatarFilesAsync(formData: FormData) {
    return await this._http.post(this.apiUrl + `/project-management-settings/user-avatar-file`, formData).pipe(
      tap(_ => console.log("Файлы аватара успешно добавлены"))
    );
  };

  /**
   * Функция поиска задач.
   * @param searchText - Поисковый текст.
   * @param projectIds - Id проектов, по которым искать.
   * @param isById - Признак поиска по Id задачи.
   * @param isByName - Признак поиска по названию задачи.
   * @param IsByDescription - Признак поиска по описанию задачи.
   */
  public async searchTasksAsync(searchText: string, projectIds: number[], isById: boolean, isByName: boolean, isByDescription: boolean) {
    return await this._http.get(this.apiUrl +
      `/project-management-search/search-task?searchText=${searchText}&projectIds=${projectIds}&isById=${isById}&isByName=${isByName}&isByDescription=${isByDescription}`).pipe(
      tap(data => this.searchTasks$.next(data))
    );
  };

  /**
   * Функция получает список задач, историй для бэклога.
   * @param projectId - Id проекта.
   */
  public async getBacklogTasksAsync(projectId: number) {
    return await this._http.get(this.apiUrl +
      `/project-management/backlog-tasks?projectId=${projectId}`).pipe(
      tap(data => this.backlogData$.next(data))
    );
  };

  /**
   * Функция получает эпики, доступные к добавлению в них задачи.
   * @param projectId - Id проекта.
   */
  public async getAvailableEpicsAsync(projectId: number) {
    return await this._http.get(this.apiUrl + `/project-management/available-epics?projectId=${projectId}`).pipe(
      tap(data => this.availableEpics$.next(data))
    );
  };

  /**
   * Функция получает список эпиков.
   * @param projectId - Id проекта.
   */
  public async getEpicsAsync(projectId: number) {
    return await this._http.get(this.apiUrl + `/project-management/epics?projectId=${projectId}`).pipe(
      tap(data => this.epics$.next(data))
    );
  };

  /**
   * Функция добавляет задачу в эпик.
   * @param includeTaskEpicInput - Входная модель.
   */
  public async includeTaskEpicAsync(includeTaskEpicInput: IncludeTaskEpicInput) {
    return await this._http.post(this.apiUrl + `/project-management/task-epic`, includeTaskEpicInput).pipe(
      tap(data => this.includeEpic$.next(data))
    );
  };

  /**
   * Функция добавляет задачу в спринт.
   * @param includeTaskSprintInput - Входная модель.
   */
  public async includeTaskSprintAsync(includeTaskSprintInput: IncludeTaskSprintInput) {
    return await this._http.post(this.apiUrl + `/project-management/sprints/sprint-task`, includeTaskSprintInput).pipe(
      tap(data => this.includeEpic$.next(data))
    );
  };

  /**
   * Функция планирует спринт.
   * Добавляет задачи в спринт, если их указали при планировании спринта.
   * @param planingSprintInput - Входная модель.
   */
  public async planingSprintAsync(planingSprintInput: PlaningSprintInput) {
    return await this._http.post(this.apiUrl + `/project-management/sprints/sprint/planing`, planingSprintInput).pipe(
      tap(_ => console.log("Спринт успешно спланирован"))
    );
  };

  /**
   * Функция получает статусы истории для выбора.
   */
  public async getUserStoryStatusesAsync() {
    return await this._http.get(this.apiUrl + `/project-management/history-statuses`).pipe(
      tap(data => this.userStoryStatuses$.next(data))
    );
  };

  /**
   * Функция находит Agile-объект. Это может быть задача, эпик, история, ошибка.
   */
  public async searchAgileObjectAsync(searchText: string,
                                      isSearchByProjectTaskId: boolean,
                                      isSearchByTaskName: boolean,
                                      isSearchByTaskDescription: boolean,
                                      projectId: number,
                                      searchAgileObjectType: SearchAgileObjectTypeEnum) {
    if (searchAgileObjectType == SearchAgileObjectTypeEnum.Sprint) {
      return await this._http.get(this.apiUrl +
        `/project-management-search/search-agile-object?searchText=${searchText}
      &isSearchByProjectTaskId=${isSearchByProjectTaskId}
      &isSearchByTaskName=${isSearchByTaskName}
      &isSearchByTaskDescription=${isSearchByTaskDescription}
      &projectId=${projectId}
      &searchAgileObjectType=${searchAgileObjectType}`).pipe(
        tap(data => this.sprintTasks$.next(data))
      );
    }

    if (searchAgileObjectType == SearchAgileObjectTypeEnum.Epic) {
      return await this._http.get(this.apiUrl +
        `/project-management-search/search-agile-object?searchText=${searchText}
      &isSearchByProjectTaskId=${isSearchByProjectTaskId}
      &isSearchByTaskName=${isSearchByTaskName}
      &isSearchByTaskDescription=${isSearchByTaskDescription}
      &projectId=${projectId}
      &searchAgileObjectType=${searchAgileObjectType}`).pipe(
        tap(data => this.epicTasks$.next(data))
      );
    }

    else {
      throw new Error("Неизвестный тип поиска.");
    }
  };

  /**
   * Функция получает спринты, в которые может быть добавлена задача.
   *  Исключается спринт, в который задача уже добавлена.
   * @param projectId - Id проекта.
   * @param projectTaskId - Id задачи в рамках проекта.
   */
  public async getAvailableProjectSprintsAsync(projectId: number, projectTaskId: string) {
    return await this._http.get(this.apiUrl + `/project-management/available-sprints?projectId=${projectId}&projectTaskId=${projectTaskId}`).pipe(
      tap(data => this.sprintTask$.next(data))
    );
  };

  /**
   * Функция обновляет спринт, в который входит задача.
   * @param UudateTaskSprintInput - Входная модель.
   */
  public async updateTaskSprintAsync(updateTaskSprintInput: UpdateTaskSprintInput) {
    return await this._http.put(this.apiUrl + `/project-management/task/sprint`, updateTaskSprintInput).pipe(
      tap(_ => console.log("Спринт задачи успешно обновлен"))
    );
  };

  /**
   * Функция получает задачи эпика.
   * @param projectId - Id проекта.
   * @param epicId - Id эпика.
   */
  public async getEpicTasksAsync(projectId: number, epicId: number) {
    return await this._http.get(this.apiUrl + `/project-management/epic-task?projectId=${projectId}&epicId=${epicId}`).pipe(
      tap(data => this.epicTasks$.next(data))
    );
  };

  /**
   * Функция получает список спринтов для бэклога проекта.
   * @param projectId - Id проекта.
   */
  public async getSprintsAsync(projectId: number) {
    return await this._http.get(this.apiUrl + `/project-management/sprints/sprint-list?projectId=${projectId}`).pipe(
      tap(data => this.sprints.next(data))
    );
  };

  /**
   * Функция получает детали эпика.
   * @param projectId - Id проекта.
   * @param projectSprintId - Id спринта проекта.
   */
  public async getSprintDetailsAsync(projectId: number, projectSprintId: number) {
    return await this._http.get(this.apiUrl + `/project-management/sprints/sprint?projectId=${projectId}&projectSprintId=${projectSprintId}`).pipe(
      tap(data => this.sprintDetails$.next(data))
    );
  };

  /**
   * Функция обновляет название спринта.
   * @param updateSprintNameInput - Входная модель.
   */
  public async updateSprintNameAsync(updateSprintNameInput: UpdateSprintNameInput) {
    return await this._http.patch(this.apiUrl + `/project-management/sprints/sprint-name`, updateSprintNameInput).pipe(
      tap(_ => console.log("Название спринта успешно обновлено."))
    );
  };

  /**
   * Функция побновляет описание спринта.
   * @param updateSprintDetailsInput - Входная модель.
   */
  public async updateSprintDetailsAsync(updateSprintDetailsInput: UpdateSprintDetailsInput) {
    return await this._http.patch(this.apiUrl + `/project-management/sprints/sprint-details`, updateSprintDetailsInput).pipe(
      tap(_ => console.log("Описание спринта успешно обновлено."))
    );
  };

  /**
   * Функция побновляет исполнителя спринта (ответственный за выполнение спринта).
   * @param updateSprintExecutorInput
   */
  public async updateSprintExecutorAsync(updateSprintExecutorInput: UpdateSprintExecutorInput) {
    return await this._http.patch(this.apiUrl + `/project-management/sprints/sprint-executor`, updateSprintExecutorInput).pipe(
      tap(_ => console.log("Исполнитель спринта успешно обновлен."))
    );
  };

  /**
   * Функция побновляет наблюдателей спринта.
   * @param updateSprintWatchersInput
   */
  public async updateSprintWatchersAsync(updateSprintWatchersInput: UpdateSprintWatchersInput) {
    return await this._http.patch(this.apiUrl + `/project-management/sprints/sprint-watcher`, updateSprintWatchersInput).pipe(
      tap(_ => console.log("Наблюдатели спринта успешно обновлены."))
    );
  };

  /**
   * Функция начинает спринт проекта.
   * @param sprintInput - Входная модель.
   */
  public async runSprintAsync(sprintInput: SprintInput) {
    return await this._http.patch(this.apiUrl + `/project-management/sprints/sprint/start`, sprintInput).pipe(
      tap(_ => console.log("Спринт успешно начат."))
    );
  };

  /**
   * Функция завершает спринт (ручное завершение).
   * @param sprintInput - Входная модель.
   */
  public async nanualCompleteSprintAsync(sprintInput: SprintInput) {
    return await this._http.patch(this.apiUrl + `/project-management/sprints/sprint/manual-complete`, sprintInput).pipe(
      tap(_ => console.log("Спринт успешно завершен."))
    );
  };

  /**
   * Функция получает список спринтов доступных для переноса незавершенных задач в один из них.
   * @param projectId - Id проекта.
   * @param projectSprintId - Id спринта проекта.
   */
  public async getAvailableNextSprintsAsync(projectId: number, projectSprintId: number) {
    return await this._http.get(this.apiUrl + `/project-management/sprints/available-next-sprints?projectSprintId=${projectSprintId}&projectId=${projectId}`).pipe(
      tap(_ => console.log("Будущие спринты для переноса нерешенных задач."))
    );
  };

  /**
   * Функция получает настройки длительности спринтов проекта.
   * @param projectId - Id проекта.
   */
  public async getScrumDurationSettingsAsync(projectId: number) {
    return await this._http.get(this.apiUrl + `/project-management-settings/sprint-duration-settings?projectId=${projectId}`).pipe(
      tap(data => this.sprintDurationSettings$.next(data))
    );
  };

  /**
   * Функция получает настройки автоматического перемещения нерешенных задач спринта.
   * @param projectId - Id проекта.
   */
  public async getProjectSprintsMoveNotCompletedTasksSettingsAsync(projectId: number) {
    return await this._http.get(this.apiUrl + `/project-management-settings/sprint-move-not-completed-tasks-settings?projectId=${projectId}`).pipe(
      tap(data => this.sprintMoveNotCompletedTasksSettings$.next(data))
    );
  };

  /**
   * Функция обновляет настройки длительности спринтов проекта.
   * @param sprintDurationSettingInput - Входная модель.
   */
  public async updateScrumDurationSettingsAsync(sprintDurationSettingInput: SprintDurationSettingInput) {
    return await this._http.patch(this.apiUrl + `/project-management-settings/sprint-duration-settings`, sprintDurationSettingInput).pipe(
      tap(_ => console.log("Настройка длительности спринтов успешно изменена."))
    );
  };

  /**
   * Функция обновляет настройки перемещения нерешенных задач спринтов проекта.
   * @param sprintMoveNotCompletedTaskSettingInput - Входная модель.
   */
  public async updateProjectSprintsMoveNotCompletedTasksSettingsAsync(sprintMoveNotCompletedTaskSettingInput: SprintMoveNotCompletedTaskSettingInput) {
    return await this._http.patch(this.apiUrl + `/project-management-settings/sprint-move-not-completed-tasks-settings`, sprintMoveNotCompletedTaskSettingInput).pipe(
      tap(_ => console.log("Настройка перемещения нерешенных задач спринтов успешно изменена."))
    );
  };

  /**
   * Функция получает все раб.пространства, в которых есть текущий пользователь.
   */
  public async getWorkSpacesAsync() {
    return await this._http.get(this.apiUrl + `/project-management/workspaces`).pipe(
      tap(data => this.workspaces$.next(data))
    );
  };

  /**
   * Функция получает выбранное раб.пространство.
   * @paaram projectId - Id проекта.
   */
  public async getSelectedWorkSpaceAsync(projectId: number) {
    return await this._http.get(this.apiUrl + `/project-management/workspace?projectId=${projectId}`).pipe(
      tap(data => this.selectedWorkSpace$.next(data))
    );
  }

  /**
   * Функция получает список пользователей, которые состоят в проекте.
   */
  public async getCompanyProjectUsersAsync(projectId: number) {
    return await this._http.get(this.apiUrl + `/project-management-settings/company-project-users?projectId=${projectId}`).pipe(
      tap(data => this.settingUsers.next(data))
    );
  };

  /**
   * Функция получает список ролей пользователя.
   * @param projectId - Id проекта.
   * @param companyId - Id компании.
   */
  public async getUserRolesAsync(projectId: number, companyId: number) {
    return await this._http.get(this.apiUrl + `/project-management-role/user-roles?projectId=${projectId}&companyId=${companyId}`).pipe(
      tap(data => this.userRoles.next(data))
    );
  };

  /**
   * Функция получает список ролей пользователей для настроек.
   * @param projectId - Id проекта.
   * @param companyId - Id компании.
   */
  public async getSettingUsersRolesAsync(projectId: number, companyId: number) {
    return await this._http.get(
      this.apiUrl + `/project-management-role/roles?projectId=${projectId}&companyId=${companyId}`
    ).pipe(
      tap(data => this.settingUserRoles.next(data))
    );
  };

  /**
   * Функция обновляет роли.
   * @param updated - Входная модель.
   */
  public async updateRolesAsync(updated: UpdateRoleInput) {
    return await this._http.put(this.apiUrl + `/project-management-role/roles`, updated).pipe(
      tap(data => this.settingUserRoles.next(data))
    );
  };

  /**
   * Функция получает дерево Wiki модуля УП.
   */
  public async getWikiTreeItemsAsync(projectId: number) {
    return await this._http.get(this.apiUrl + `/project-management-wiki/tree?projectId=${projectId}`).pipe(
      tap(data => this.wikiTreeItems$.next(data))
    );
  };

  /**
   * Функция получает папку (и ее структуру - вложенные папки и страницы).
   * @param projectId - Id проекта.
   * @param folderId - Id папки.
   */
  public async getTreeItemFolderAsync(projectId: number, folderId: number) {
    return await this._http.get(this.apiUrl + `/project-management-wiki/tree-item-folder?projectId=${projectId}&folderId=${folderId}`).pipe(
      tap(data => this.wikiTreeFolderItems$.next(data))
    );
  };

  /**
   * Функция получает содержимое страницы.
   * @param pageId - Id страницы.
   */
  public async getTreeItemPageAsync(pageId: number) {
    return await this._http.get(this.apiUrl + `/project-management-wiki/tree-item-page?pageId=${pageId}`).pipe(
      tap(data => this.wikiTreeFolderPage$.next(data))
    );
  };

  /**
   * Функция изменяет название папки.
   * @param updateFolderNameInput - Входная модель.
   */
  public async updateFolderNameAsync(updateFolderNameInput: UpdateFolderNameInput) {
    return await this._http.patch(this.apiUrl + `/project-management-wiki/tree-item-folder`, updateFolderNameInput).pipe(
      tap(data => this.wikiTreeFolderItems$.next(data))
    );
  };

  /**
   * Функция изменяет название страницы папки.
   * @param updateFolderPageNameInput
   */
  public async updateFolderPageNameAsync(updateFolderPageNameInput: UpdateFolderPageNameInput) {
    return await this._http.patch(this.apiUrl + `/project-management-wiki/tree-item-folder-page-name`, updateFolderPageNameInput).pipe(
      tap(data => this.wikiTreeFolderPage$.next(data))
    );
  };

  /**
   * Функция изменяет название страницы папки.
   * @param updateFolderPageDescriptionInput
   */
  public async updateFolderPageDescriptionAsync(updateFolderPageDescriptionInput: UpdateFolderPageDescriptionInput) {
    return await this._http.patch(this.apiUrl + `/project-management-wiki/tree-item-folder-page-description`, updateFolderPageDescriptionInput).pipe(
      tap(data => this.wikiTreeFolderPage$.next(data))
    );
  };

  /**
   * Функция получает элементы контекстного меню.
   * @param projectId - Id проекта, если передан.
   * @param pageId - Id страницы, если передан.
   */
  public async getContextMenuAsync(projectId: number | null = null, pageId: number | null, isParentFolder: boolean = false) {
    if (isParentFolder) {
      return await this._http.get(this.apiUrl + `/project-management-wiki/context-menu?projectId=${projectId}&isParentFolder=${isParentFolder}`).pipe(
        tap(data => this.wikiContextMenu$.next(data))
      );
    }

    if ((projectId != null && projectId > 0) && (pageId == null || pageId <= 0)) {
      return await this._http.get(this.apiUrl + `/project-management-wiki/context-menu?projectId=${projectId}`).pipe(
        tap(data => this.wikiContextMenu$.next(data))
      );
    }

    return await this._http.get(this.apiUrl + `/project-management-wiki/context-menu?projectId=${projectId}&pageId=${pageId}`).pipe(
      tap(data => this.wikiContextMenu$.next(data))
    );
  };

  /**
   * Функция создает папку.
   * @param createWikiFolderInput - Входная модель.
   */
  public async createFolderAsync(createWikiFolderInput: CreateWikiFolderInput) {
    return await this._http.post(this.apiUrl + `/project-management-wiki/tree-item-folder`, createWikiFolderInput).pipe(
      tap(_ => console.log("Папка успешно создана."))
    );
  };

  /**
   * Функция создает страницу.
   * @param createWikiPageInput - Входная модель.
   */
  public async createPageAsync(createWikiPageInput: CreateWikiPageInput) {
    return await this._http.post(this.apiUrl + `/project-management-wiki/tree-item-page`, createWikiPageInput).pipe(
      tap(_ => console.log("Страница успешно создана."))
    );
  };

  /**
   * Функция удаляет папку.
   * @param createWikiPageInput - Входная модель.
   */
  public async removeFolderAsync(folderId: number, isApprove: boolean) {
    return await this._http.delete(this.apiUrl + `/project-management-wiki/tree-item-folder?folderId=${folderId}&isApprove=${isApprove}`).pipe(
      tap(data => this.removeFolderResponse$.next(data))
    );
  };

  /**
   * Функция удаляет страницу.
   * @param pageId - Id страницы.
   */
  public async removePageAsync(pageId: number) {
    return await this._http.delete(this.apiUrl + `/project-management-wiki/tree-item-page?pageId=${pageId}`).pipe(
      tap(_ => console.log("Страница успешно удалена."))
    );
  };

  /**
   * Функция получает список приглашений в проект.
   * @param projectId - Id проекта.
   */
  public async getProjectInvitesAsync(projectId: number) {
    return await this._http.get(this.apiUrl + `/project-management-settings/project-invites?projectId=${projectId}`).pipe(
      tap(data => this.projectInvites$.next(data))
    );
  };

  /**
   * Функция отменяет приглашение.
   * @param notificationId - Id уведомления.
   */
  public async cancelProjectInviteAsync(notificationId: number) {
    return await this._http.delete(this.apiUrl + `/project-management-settings/cancel-project-invite?notificationId=${notificationId}`).pipe(
      tap(_ => console.log("Приглашение успешно отменено."))
    );
  };

  /**
   * Функция отменяет приглашение.
   * @param userId - Id пользователя.
   * @param projectId - Id проекта.
   */
  public async removeUserProjectTeamAsync(userId: number, projectId: number) {
    return await this._http.delete(this.apiUrl + `/project-management-settings/remove-project-team?userId=${userId}&projectId=${projectId}`).pipe(
      tap(_ => console.log("Участник исключен из команды."))
    );
  };

  /**
   * Функция удаляет задачу.
   * @param projectId - Id проекта.
   * @param projectTaskId - Id задачи в рамках проекта.
   * @param TaskDetailTypeEnum - Тип задачи.
   */
  public async removeProjectTaskAsync(projectId: number, projectTaskId: string, taskType: string) {
    return await this._http.delete(this.apiUrl + `/project-management/task?projectId=${projectId}&projectTaskId=${projectTaskId}&taskType=${taskType}`).pipe(
      tap(_ => console.log("Задача успешно удалена."))
    );
  };

  /**
   * Функция удаляет задачу и зэпика.
   * @param excludeTaskInput - Входная модель.
   */
  public async removeEpicTasksAsync(excludeTaskInput: ExcludeTaskInput) {
    return await this._http.patch(this.apiUrl + `/project-management/epics/epic-task`, excludeTaskInput).pipe(
      tap(_ => console.log("Задачи успешно удалены из эпика."))
    );
  };

  /**
   * Функция удаляет задачу из спринта.
   * @param excludeTaskInput - Входная модель.
   */
  public async removeSprintTasksAsync(excludeTaskInput: ExcludeTaskInput) {
    return await this._http.patch(this.apiUrl + `/project-management/sprints/sprint-task`, excludeTaskInput).pipe(
      tap(_ => console.log("Задачи успешно удалены из спринта."))
    );
  };

  /**
   * Функция вычисляет кол-во компаний пользователя.
   */
  public async calculateUserCompanyAsync() {
    return await this._http.get(this.apiUrl + `/project-management/companies/calculate-user-company`).pipe(
      tap(data => this.calculateUserCompanies.next(data))
    );
  };

  /**
   * Функция получает список компаний пользователя.
   */
  public async getUserCompaniesAsync() {
    return await this._http.get(this.apiUrl + `/project-management/companies/user-companies`).pipe(
      tap(data => this.userCompanies$.next(data))
    );
  };

  /**
   * Функция добавляет компанию в кэш.
   * @param companyInput - Входная модель.
   */
  public async createCompanyCacheAsync(companyInput: CompanyInput) {
    return await this._http.post(this.apiUrl + `/project-management/companies/company-cache`, companyInput).pipe(
      tap(_ => console.log("Компания успешно добавлена в кэш."))
    );
  };
}
