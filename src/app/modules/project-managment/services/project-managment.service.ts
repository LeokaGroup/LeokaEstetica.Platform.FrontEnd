import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { API_URL } from 'src/app/core/core-urls/api-urls';
import { ChangeTaskDetailsInput } from '../task/models/input/change-task-details-input';
import { ChangeTaskNameInput } from '../task/models/input/change-task-name-input';
import { ChangeTaskStatusInput } from '../task/models/input/change-task-status-input';
import { ConfigSpaceSettingInput } from '../task/models/input/config-space-setting-input';
import { CreateProjectManagementTaskInput } from '../task/models/input/create-task-input';
import { CreateTaskStatusInput } from '../task/models/input/create-task-status-input';
import { ProjectTaskExecutorInput } from '../task/models/input/project-task-executor-input';
import { ProjectTaskTagInput } from '../task/models/input/project-task-tag-input';
import { ProjectTaskWatcherInput } from '../task/models/input/project-task-watcher-input';
import { TaskLinkInput } from '../task/models/input/task-link-input';
import { TaskPriorityInput } from '../task/models/input/task-priority-input';
import { UserTaskTagInput } from '../task/models/input/user-task-tag-input';

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
        return await this._http.get(this.apiUrl + "/project-management/header").pipe(
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
    * @param strategy - Выбранная стратегия.
    * @param templateId - Id выбранного шаблона.
    * @returns - Данные конфигурации.
    */
    public async getConfigurationWorkSpaceBySelectedTemplateAsync(projectId: number, strategy: string,
        templateId: number) {
        return await this._http.get(this.apiUrl + `/project-management/config-workspace-template?projectId=${projectId}
        &strategy=${strategy}
        &templateId=${templateId}`).pipe(
            tap(data => this.workSpaceConfig$.next(data))
        );
    };

     /**
    * Функция получает детали задачи.
    * @param projectId - Id проекта.
    * @param taskId - Id задачи.
    * @returns - Данные конфигурации.
    */
      public async getTaskDetailsByTaskIdAsync(projectId: number, projectTaskId: number) {
        return await this._http.get(this.apiUrl + `/project-management/task?projectTaskId=${projectTaskId}&projectId=${projectId}`).pipe(
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
     public async getProjectTagsAsync() {
        return await this._http.get(this.apiUrl + "/project-management/project-tags").pipe(
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
    * @returns - Выходная модель.
    */
      public async getBuildProjectSpaceSettingsAsync() {
        return await this._http.get(this.apiUrl + "/project-management/config/build-project-space").pipe(
            tap(data => this.projectWorkspaceSettings$.next(data))
        );
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
    * @returns - Доступные переходы.
    */
      public async getAvailableTaskStatusTransitionsAsync(projectId: number, projectTaskId: number) {
        return await this._http.get(this.apiUrl + `/project-management/available-task-status-transitions?projectId=${projectId}&projectTaskId=${projectTaskId}`).pipe(
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
      public async getTaskLinkDefaultAsync(projectId: number, projectTaskId: number) {
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
      public async getTaskLinkChildAsync(projectId: number, projectTaskId: number) {
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
      public async getTaskLinkDependAsync(projectId: number, projectTaskId: number) {
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
     public async getTaskLinkBlockedAsync(projectId: number, projectTaskId: number) {
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
      public async getTaskFilesAsync(projectId: number, projectTaskId: number) {
        return await this._http.get(this.apiUrl + `/project-management/task-files?projectId=${projectId}&projectTaskId=${projectTaskId}`).pipe(
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
     * @param documentId - Id документа.
   * @param projectId - Id проекта.
   * @param projectTaskId - Id задачи в рамках проекта.
   */
    public async removeTaskFileAsync(documentId: number, projectId: number, projectTaskId: number) {
        return await this._http.delete(this.apiUrl + 
            `/project-management/task-file?documentId=${documentId}&projectId=${projectId}&projectTaskId=${projectTaskId}`).pipe(
            tap(_ => console.log("Файл задачи успешно удален"))
        );
    };
}
