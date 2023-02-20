import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { MessageService } from "primeng/api";
import { forkJoin } from "rxjs";
import { DialogInput } from "src/app/modules/messages/chat/models/input/dialog-input";
import { DialogMessageInput } from "src/app/modules/messages/chat/models/input/dialog-message-input";
import { ChatMessagesService } from "src/app/modules/messages/chat/services/chat-messages.service";
import { SignalrService } from "src/app/modules/notifications/signalr/services/signalr.service";
import { SearchProjectService } from "src/app/modules/search/services/search-project-service";
import { VacancyInput } from "src/app/modules/vacancy/models/input/vacancy-input";
import { VacancyService } from "src/app/modules/vacancy/services/vacancy.service";
import { ProjectService } from "../../services/project.service";
import { AttachProjectVacancyInput } from "../models/input/attach-project-vacancy-input";
import { CreateProjectCommentInput } from "../models/input/create-project-comment-input";
import { InviteProjectTeamMemberInput } from "../models/input/invite-project-team-member-input";
import { ProjectResponseInput } from "../models/input/project-response-input";
import { UpdateProjectInput } from "../models/input/update-project-input";
import {BackOfficeService} from "../../../backoffice/services/backoffice.service";

@Component({
    selector: "detail",
    templateUrl: "./detail.component.html",
    styleUrls: ["./detail.component.scss"]
})

/**
 * Класс деталей проекта (используется для изменения и просмотра проекта).
 */
export class DetailProjectComponent {
    constructor(private readonly _projectService: ProjectService,
        private readonly _activatedRoute: ActivatedRoute,
        private readonly _signalrService: SignalrService,
        private readonly _messageService: MessageService,
        private readonly _router: Router,
        private readonly _vacancyService: VacancyService,
        private readonly _messagesService: ChatMessagesService,
        private readonly _searchProjectService: SearchProjectService,
        //кнопка удалить - Вакансии проекта
        private readonly _backofficeService: BackOfficeService) {
    }

    public readonly catalog$ = this._projectService.catalog$;
    public readonly selectedProject$ = this._projectService.selectedProject$;
    public readonly projectStages$ = this._projectService.projectStages$;
    public readonly projectVacancies$ = this._projectService.projectVacancies$;
    public readonly projectVacanciesColumns$ = this._projectService.projectVacanciesColumns$;
    public readonly availableAttachVacancies$ = this._projectService.availableAttachVacancies$;
    public readonly selectedVacancy$ = this._vacancyService.selectedVacancy$;
    public readonly messages$ = this._messagesService.messages$;
    public readonly dialog$ = this._messagesService.dialog$;
    public readonly createdProjectComment$ = this._projectService.createdProjectComment$;
    public readonly projectTeamColumns$ = this._projectService.projectTeamColumns$;
    public readonly searchInviteMembers$ = this._searchProjectService.searchInviteMembers$;
    public readonly invitedProjectTeamMember$ = this._projectService.invitedProjectTeamMember$;

    projectName: string = "";
    projectDetails: string = "";
    projectId: number = 0;
    allFeedSubscription: any;
    isEditMode: boolean = false;
    selectedStage: any;
    isEdit: any;
    selectedProjectVacancy: any;
    totalVacancies: number = 0;
    isShowAttachVacancyModal: boolean = false;
    selectedVacancy: any;
    vacancyName: string = "";
    vacancyText: string = "";
    workExperience: string = "";
    employment: string = "";
    payment: string = "";
    isShowVacancyModal: boolean = false;
    vacancyId: number = 0;
    isResponseVacancy: boolean = false;
    isResponseNotVacancy: boolean = false;
    message: string = "";
    dialogId: number = 0;
    userName: string = "";
    projectComment: string = "";
    aProjectComments: any[] = [];
    projectTeamColumns: any[] = [];
    projectTeam: any;
    selectedProjectMember: any;
    searchText: string = "";
    aProjectInvitesUsers: any[] = [];
    aSelectedProjectMembers: any[] = [];
    selectedInviteVacancy: any;
    selectedInviteUser: string = "";
    isDeleteProject: boolean = false;
    isDeleteVacancyInProject: boolean = false;
    public async ngOnInit() {
        forkJoin([
        this.checkUrlParams(),
        await this.getProjectStagesAsync(),
        await this.getProjectVacanciesAsync(),
        await this.getProjectVacanciesColumnNamesAsync(),
        await this.getAvailableAttachVacanciesAsync(),
        await this.getProjectDialogsAsync(),
        await this.onWriteOwnerDialogAsync(),
        // await this.getProjectDialogMessages(),
        await this.getProjectCommentsAsync(),
        await this.getProjectTeamColumnsNamesAsync(),
        await this.getProjectTeamAsync()
        ]).subscribe();

         // Подключаемся.
         this._signalrService.startConnection().then(() => {
            console.log("Подключились");

            this.listenAllHubsNotifications();

            // Подписываемся на получение всех сообщений.
            this.allFeedSubscription = this._signalrService.AllFeedObservable
                .subscribe((response: any) => {
                    console.log("Подписались на сообщения", response);
                    this._messageService.add({ severity: response.notificationLevel, summary: response.title, detail: response.message });
                });
        });
    };

     /**
     * Функция слушает все хабы.
     */
      private listenAllHubsNotifications() {
        this._signalrService.listenSuccessUpdatedUserVacancyInfo();
        this._signalrService.listenSuccessAttachProjectVacancyInfo();
        this._signalrService.listenErrorDublicateAttachProjectVacancyInfo();
        this._signalrService.listenSuccessProjectResponseInfo();
        this._signalrService.listenWarningProjectResponseInfo();
        this._signalrService.listenSuccessDeleteProjectVacancy();
        this._signalrService.listenErrorDeleteProjectVacancy();
    };

    private checkUrlParams() {
        this._activatedRoute.queryParams
        .subscribe(params => {
            let mode = params["mode"];

            if (mode == "view") {
                this.getEditProjectAsync(params["projectId"], "View");
                this.isEditMode = false;
            }

            if (mode == "edit") {
                this.getEditProjectAsync(params["projectId"], "Edit");
                this.isEditMode = true;
            }

            this.projectId = params["projectId"];
          });
    };

     /**
     * Функция загружает список вакансий для каталога.
     * @param projectId - Id проекта.
     * @param mode - Режим. Чтение или изменение.
     * @returns - Список вакансий.
     */
      private async getEditProjectAsync(projectId: number, mode: string) {
        (await this._projectService.getProjectAsync(projectId, mode))
        .subscribe(_ => {
            console.log("Получили проект: ", this.selectedProject$.value);
        });
    };

    /**
     * Функция обновляет проект.
     * @returns - Обновленные данные проекта.
     */
    public async onUpdateProjectAsync() {
        let model = new UpdateProjectInput();
        model.ProjectName = this.selectedProject$.value.projectName;
        model.ProjectDetails = this.selectedProject$.value.projectDetails;
        model.ProjectId = this.projectId;

        (await this._projectService.updateProjectAsync(model))
        .subscribe(_ => {
            console.log("Обновили проект: ", this.selectedProject$.value);
        });
    };

    /**
     * Функция получает список стадий проекта.
     * @returns - Список стадий проекта.
     */
     private async getProjectStagesAsync() {
        (await this._projectService.getProjectStagesAsync())
            .subscribe(_ => {
                console.log("Стадии проекта для выбора: ", this.projectStages$.value);
            });
    };

    public onSelectProjectStage() {
        console.log(this.selectedStage);
    };

    /**
     * Функция получает список вакансий проекта.
     * @returns - Список вакансий проекта.
     */
    private async getProjectVacanciesAsync() {
        (await this._projectService.getProjectVacanciesAsync(this.projectId))
            .subscribe(_ => {
                console.log("Вакансии проекта: ", this.projectVacancies$.value);
                this.totalVacancies = this.projectVacancies$.value.total;
            });
    };

     /**
    // * Функция получает поля таблицы проектов пользователя.
    // * @returns - Список полей.
    */
    private async getProjectVacanciesColumnNamesAsync() {
        (await this._projectService.getProjectVacanciesColumnNamesAsync())
            .subscribe(_ => {
                console.log("Столбцы таблицы вакансий проектов пользователя: ", this.projectVacanciesColumns$.value);
            });
    };

    /**
     * Функция переходит на страницу создания вакансии проекта. Передавая Id проекта, к которому будет привязана вакансия автоматически.
     */
    public onRouteCreateProjectVacancy() {
        let projectId = this.projectId;

        this._router.navigate(["/vacancies/create"], {
            queryParams: {
                projectId
            }
        });
    };

    /**
     * Функция отображает модалку для прикрепления вакансии к проекту.
     */
    public onShowAttachModel() {
        this.isShowAttachVacancyModal = true;
    };

    /**
    // * Функция получает список вакансий пользователя, которые можно прикрепить к проекту
    // * @returns - Список вакансий.
    */
    private async getAvailableAttachVacanciesAsync() {
        (await this._projectService.getAvailableAttachVacanciesAsync(this.projectId))
            .subscribe(_ => {
                console.log("Доступные к привязке вакансии: ", this.availableAttachVacancies$.value);
            });
    };

    public onSelectVacancy() {
        console.log(this.selectedVacancy);
    };

    /**
     * Функция прикрепляет вакансию к проекту.
     */
    public async onSaveProjectVacancyAsync() {
        let attachModel = new AttachProjectVacancyInput();
        attachModel.ProjectId = this.selectedVacancy.projectId;
        attachModel.VacancyId = this.selectedVacancy.vacancyId;

        (await this._projectService.attachProjectVacancyAsync(attachModel))
        .subscribe(async _ => {
            console.log("Прикрепили вакансию: ", this.selectedVacancy.vacancyId);
            this.isShowAttachVacancyModal = false;
            await this.getProjectVacanciesAsync();
        });
    };

    /**
     * Функция показывает модалку вакансии.
     * @param vacancyId - Id вакансии.
     */
    public async onShowVacancyModal(vacancyId: number, isEdit: boolean) {
        console.log(this.isShowVacancyModal);
        this.isShowVacancyModal = true;
        this.isEditMode = isEdit;

        if (isEdit) {
            this.vacancyId = vacancyId;
        }

        (await this._vacancyService.getVacancyByIdAsync(vacancyId))
        .subscribe(async _ => {
            console.log("Получили вакансию: ", this.selectedVacancy$.value);
            this.vacancyName = this.selectedVacancy$.value.vacancyName;
            this.vacancyText = this.selectedVacancy$.value.vacancyText;
            this.workExperience = this.selectedVacancy$.value.workExperience;
            this.employment = this.selectedVacancy$.value.employment;
            this.payment = this.selectedVacancy$.value.payment;
        });
    };

     /**
     * Функция создает вакансию вне проекта.
     * @returns - Данные вакансии.
     */
      public async onUpdateVacancyAsync() {
        let model = this.UpdateVacancyModel();
        (await this._vacancyService.updateVacancyAsync(model))
        .subscribe((response: any) => {
            if (response.errors !== null && response.errors.length > 0) {
                response.errors.forEach((item: any) => {
                    this._messageService.add({ severity: 'error', summary: "Что то не так", detail: item.errorMessage });
                });
            }

            // else {
            //     setTimeout(() => {
            //         this._router.navigate(["/vacancies"]);
            //     }, 4000);
            // }
        });
    };

    /**
     * Функция создает модель для обновления вакансии проекта.
     * @returns - Входная модель вакансии.
     */
     private UpdateVacancyModel(): VacancyInput {
        let model = new VacancyInput();
        model.VacancyName = this.vacancyName;
        model.VacancyText = this.vacancyText;
        model.Employment = this.employment;
        model.Payment = this.payment;
        model.WorkExperience = this.workExperience;
        model.VacancyId = this.vacancyId;

        return model;
    };

    /**
     * Первичная обработка отклика на проект.
     * С вакансией либо без нее.
     * @param isResponseVacancy - Признак отклика с вакансией либо без нее.
     */
    public onShowProjectResponseWithVacancyModal(isResponseVacancy: boolean) {
        this.isResponseVacancy = isResponseVacancy;
    };

    /**
     * Первичная обработка отклика на проект без вакансии.
     * С вакансией либо без нее.
     * @param isResponseVacancy - Признак отклика с вакансией либо без нее.
     */
     public onShowProjectResponseNotVacancyModal(isResponseNotVacancy: boolean) {
        this.isResponseNotVacancy = isResponseNotVacancy;
    };

    /**
     * Функция записывает отклик на проект.
     * Запись происходит либо с указанием вакансии либо без нее.
     * @returns - Данные отклика на проект.
     */
    public async onProjectResponseAsync() {
        let model = new ProjectResponseInput();
        model.ProjectId = this.projectId;
        model.VacancyId = this.vacancyId == 0 ? null : this.vacancyId;

        (await this._projectService.writeProjectResponseAsync(model))
            .subscribe((response: any) => {
                if (response.errors !== null && response.errors.length > 0) {
                    response.errors.forEach((item: any) => {
                        this._messageService.add({ severity: 'error', summary: "Что то не так", detail: item.errorMessage });
                    });
                }

                this.isResponseVacancy = false;
                this.isResponseNotVacancy = false;
            });
    };

    /**
     * TODO: Эту функцию запускать при раскрытии чата, не надо на ините дергать ее.
     * Функция получает список диалогов.
     * @returns - Список диалогов.
     */
    private async getProjectDialogsAsync() {
        (await this._messagesService.getProjectDialogsAsync())
        .subscribe(async _ => {
            console.log("Сообщения чата проекта: ", this.messages$.value);
            this.userName = this.messages$.value.fullName;
            console.log("userName", this.userName);

            // Диалогов нет, создаем новый пустой диалог для начала общения.
            // if (!this.messages$.value.length) {
            //     (await this._messagesService.getProjectDialogAsync(this.projectId))
            //         .subscribe(_ => {
            //             console.log("Получили диалог: ", this.dialog$.value);
            //         });
            // }
        });
    };

    /**
     * Функция получает диалог и его сообщения.
     * @param discussionTypeId - Id типа обсуждения.
     * @returns - Диалог и его сообщения.
     */
    public async onGetDialogAsync(dialogId: number) {
        this.dialogId = dialogId;

        (await this._messagesService.getProjectDialogAsync(this.projectId, dialogId))
            .subscribe(_ => {
                console.log("Сообщения диалога: ", this.dialog$.value);
            });
    };

    public async onWriteOwnerDialogAsync() {
        let dialogInput = new DialogInput();
        dialogInput.DiscussionTypeId = this.projectId;
        dialogInput.DiscussionType = "Project";

        (await this._messagesService.writeOwnerDialogAsync(dialogInput))
        .subscribe(async _ => {
            console.log("Получили диалог: ", this.dialog$.value);
            if (this.dialog$.value.dialogId > 0) {
                this.dialogId = this.dialog$.value.dialogId;
                this.userName = this.dialog$.value.fullName;
                console.log("userName", this.userName);
            }
        });
    };

    public async onSendMessageAsync() {
        let dialogInput = new DialogMessageInput();
        dialogInput.Message = this.message;
        dialogInput.DialogId = this.dialogId;

        (await this._messagesService.sendDialogMessageAsync(dialogInput))
        .subscribe(async _ => {
            console.log("Сообщения диалога: ", this.messages$.value);
            this.message = "";
            await this.onGetDialogAsync(this.dialogId);
        });
    };

    /**
     * Функция создает комментарий к проекту.
     */
    public async onCreateProjectCommentAsync() {
        let createProjectCommentInput = new CreateProjectCommentInput();
        createProjectCommentInput.ProjectId = this.projectId;
        createProjectCommentInput.Comment = this.projectComment;

        (await this._projectService.createProjectCommentAsync(createProjectCommentInput))
        .subscribe(async _ => {
            console.log("Комментарий к проекту успешно добавлен.");
            this.projectComment = "";
            await this.getProjectCommentsAsync();
        });
    };

    /**
     * Функция получает список комментариев к проекту.
     */
     private async getProjectCommentsAsync() {
        (await this._projectService.getProjectCommentsAsync(this.projectId))
        .subscribe(async (response: any) => {
            console.log("Комментарии проекта: ", response);
            this.aProjectComments = response;
        });
    };

    /**
     * Функция получает названия столбцов команды проекта.
     * @returns - Названия столбцов команды проекта.
     */
    private async getProjectTeamColumnsNamesAsync() {
        (await this._projectService.getProjectTeamColumnsNamesAsync())
        .subscribe(async (response: any) => {
            console.log("Столбцы команды проекта: ", response);
            this.projectTeamColumns = response;
        });
    };

    /**
     * Функция получает данные для таблицы команда проекта
     * @returns - Данные для таблицы команда проекта.
     */
     private async getProjectTeamAsync() {
        (await this._projectService.getProjectTeamAsync(this.projectId))
        .subscribe(async (response: any) => {
            console.log("Данные команды проекта: ", response);
            this.projectTeam = response;
        });
    };

    /**
     * Функция получает данные для таблицы команда проекта.
     * @param event - Событие. Чтобы достать текст, надо вызвать event.query.
     * @returns - Данные для таблицы команда проекта.
     */
     public async onSearchInviteProjectMembersAsync(event: any) {
        (await this._searchProjectService.searchInviteProjectMembersAsync(event.query))
        .subscribe(async (response: any) => {
            console.log("Пользователи для добавления в команду проекта: ", response);
            this.aProjectInvitesUsers = response;
        });
    };

    public onSelectProjectMember(event: any) {
        console.log(event);
        this.selectedInviteUser = event.displayName;
    };

    /**
     * Функция отправляет приглашение в команду проекта пользователю.
     */
    public async onSendInviteProjectTeamAsync() {
        let inviteProjectTeamMemberInput = new InviteProjectTeamMemberInput();
        inviteProjectTeamMemberInput.ProjectId = this.projectId;
        inviteProjectTeamMemberInput.User = this.selectedInviteUser;
        inviteProjectTeamMemberInput.VacancyId = this.selectedInviteVacancy.vacancyId;

        (await this._projectService.sendInviteProjectTeamAsync(inviteProjectTeamMemberInput))
        .subscribe(async (response: any) => {
            console.log("Добавленный в команду пользователь: ", response);
        });
    };

    /**
     * Функция удаляет проект.
     * @param projectId - Id проекта.
     */
    public async onDeleteProjectAsync() {
        (await this._projectService.deleteProjectsAsync(this.projectId))
        .subscribe(async (response: any) => {
            console.log("Удалили проект: ", response);
            this.isDeleteProject = false;

            setTimeout(() => {
                this._router.navigate(["/projects"]);
            }, 4000);
        });
    };







  /**   Mika 14.02.23
   * Функция удаляет Вакансию из Вакансии проекта при нажатии Удалить.
   * @param projectId - Id проекта; @param vacancyId = Id вакансии
   */
  /** при вервом нажатии на кнопку Удалить выскакивает диалог-удалить/отменить */
  public onBeforeDeleteProjectVacancy(vacancyId: number) {
    this.vacancyId = vacancyId;
    this.isDeleteVacancyInProject = true;
  };
  /** реализация нажатия кнопки-удалить */
  public async onDeleteVacancyInProjectAsync() {
    (await this._projectService.deleteVacancyInProjectAsync(this.projectId,this.vacancyId))
      .subscribe(async (response: any) => {
        this.isDeleteVacancyInProject = false;
        // await this.getUserVacancyInProjectsAsync();
        await this.getProjectVacanciesAsync();
      });
  };

}
