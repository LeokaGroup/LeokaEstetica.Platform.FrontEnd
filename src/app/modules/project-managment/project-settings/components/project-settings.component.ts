import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { catchError, forkJoin } from "rxjs";
import { ProjectManagmentService } from "../../services/project-managment.service";
import {ProjectUserAvatarFileInput} from "../../task/models/input/project-user-avatar-file-input";
import {SprintDurationSettingInput} from "../../sprint/models/sprint-duration-setting-input";
import {SprintMoveNotCompletedTaskSettingInput} from "../../sprint/models/sprint-move-not-completed-task-setting-input";
import { UpdateRoleInput } from "../../models/input/update-role-input";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";
import {ProjectService} from "../../../project/services/project.service";
import {SearchProjectService} from "../../../search/services/search-project-service";
import {InviteProjectTeamMemberInput} from "../../../project/detail/models/input/invite-project-team-member-input";
import {MessageService} from "primeng/api";
import {AccessService} from "../../../access/access.service";
import { Role } from "../../models/role";

@Component({
  selector: "",
  templateUrl: "./project-settings.component.html",
  styleUrls: ["./project-settings.component.scss"]
})

/**
 * Класс компонента настроек проекта.
 */
export class ProjectSettingsComponent implements OnInit {
  constructor(private readonly _projectManagmentService: ProjectManagmentService,
              private readonly _activatedRoute: ActivatedRoute,
              private readonly _domSanitizer: DomSanitizer,
              private readonly _projectService: ProjectService,
              private readonly _searchProjectService: SearchProjectService,
              private readonly _messageService: MessageService,
              private readonly _accessService: AccessService) {
  }

  public readonly downloadUserAvatarFile$ = this._projectManagmentService.downloadUserAvatarFile$;
  public readonly sprintDurationSettings$ = this._projectManagmentService.sprintDurationSettings$;
  public readonly sprintMoveNotCompletedTasksSettings$ = this._projectManagmentService.sprintMoveNotCompletedTasksSettings$;
  public readonly settingUsers = this._projectManagmentService.settingUsers;
  public readonly settingUserRoles = this._projectManagmentService.settingUserRoles;
  public readonly projectInvites$ = this._projectManagmentService.projectInvites$;
  public readonly availableInviteVacancies$ = this._projectService.availableInviteVacancies$;
  public readonly checkAccess$ = this._accessService.checkAccess$;

  projectId: number = 0;
  companyId: number = 0;
  userAvatarLink: SafeUrl | undefined;
  isShowProfile: boolean = false;
  avatarFormData = new FormData();
  isShowScrumSettings: boolean = false;
  // checked: boolean = true;
  isShowUsers: boolean = false;
  selectedUser: any;
  isShowUserRoles: boolean = false;
  aUpdatedRoles: Set<number> = new Set();
  isShowInvite: boolean = false;
  selectedInvite: any;
  isProjectInvite: boolean = false;

  items: any[] = [{
    label: 'Общие',
    items: [{
      label: 'Настройки профиля',
      command: () => {
        this.isShowProfile = true;
        this.isShowScrumSettings = false;
        this.isShowUsers = false;
        this.isShowUserRoles = false;
        this.isShowInvite = false;
      }
    }
    ]
  },
    {
      label: 'Управление проектом',
      items: [{
        label: 'Настройки Scrum',
        command: async () => {
          this.isShowProfile = false;
          this.isShowScrumSettings = true;
          this.isShowUsers = false;
          this.isShowUserRoles = false;
          this.isShowInvite = false;

          await this.getScrumDurationSettingsAsync();
          await this.getProjectSprintsMoveNotCompletedTasksSettingsAsync();
        }
      }
      ]
    },
    {
      label: 'Администрирование',
      items: [{
        label: 'Пользователи',
        command: async () => {
          this.isShowProfile = false;
          this.isShowScrumSettings = false;
          this.isShowUsers = true;
          this.isShowUserRoles = false;
          this.isShowInvite = false;

          // TODO: если будет проверка права на просмотр пользователей, то
          // подставить название роли и раскомментировать:
          // await this.checkUserRolesAsync("?");
          // а следующую строку убрать
          this.isNotRoles = false;

          await this.getSettingUsersAsync();
        }
      },
        {
          label: 'Роли',
          command: async () => {
            this.isShowProfile = false;
            this.isShowScrumSettings = false;
            this.isShowUsers = false;
            this.isShowUserRoles = true;
            this.isShowInvite = false;

            await this.getUsersRolesAsync();
            await this.checkUserRolesAsync("ProjectRole");
          }
        },
        {
          label: 'Приглашения',
          command: async () => {
            this.isShowProfile = false;
            this.isShowScrumSettings = false;
            this.isShowUsers = false;
            this.isShowUserRoles = false;
            this.isShowInvite = true;

            await this.getProjectInvitesAsync();
            this.isProjectInvite = false;

            await this.checkUserRolesAsync("ProjectInvite");
          }
        }
      ]
    }];

  aScrumDurationSettings: any[] = [];
  aMoveNotCompletedTasksSettings: any[] = [];
  // aProjectInviteVariants: any[] = [
  //   // { name: 'По ссылке', key: 'Link' },
  //   { name: 'По почте', key: 'Email' },
  //   // { name: 'По номеру телефона', key: 'PhoneNumber' },
  //   { name: 'По логину', key: 'Login' }
  // ];
  // selectedInviteVariant: any;
  availableInviteVacancies: any[] = [];
  selectedInviteVacancy: any;
  isVacancyInvite: boolean = false;
  searchText: string = "";
  selectedInviteUser: string = "";
  isVisibleAccessModal = false;
  // isInviteRole: boolean = false;
  // featureForbiddenText: string = "";
  isNotRoles: boolean = false;
  aUserRoles: any[] = [];
  isNotRolesAccessModal: boolean = false;
  currentUserRoles = new Map();
  currentUserId: number = 0;

  public async ngOnInit() {
    forkJoin([
      this.checkUrlParams(),
      await this.getUserRolesAsync(),
      await this.getFileUserAvatarAsync()
    ]).subscribe();

    this.isShowProfile = true;
  };

  private async checkUrlParams() {
    this._activatedRoute.queryParams
      .subscribe(async params => {
        this.projectId = params["projectId"];
        this.companyId = params['companyId'];
      });
  };

  /**
   * Функция получает аватар пользователя В модуле УП.
   */
  private async getFileUserAvatarAsync() {
    return new Promise(async resolve => {
      (await this._projectManagmentService.getFileUserAvatarAsync(+this.projectId))
        .subscribe((_) => {
          console.log("Аватар пользователя: ", this.downloadUserAvatarFile$.value);

          let href = URL.createObjectURL(this.downloadUserAvatarFile$.value.body);
          this.userAvatarLink = this._domSanitizer.bypassSecurityTrustUrl(href);

          resolve(this.downloadUserAvatarFile$.value);
        });
    })
  };

  /**
   * Функция выбирает файл.
   * @param event - Событие.
   */
  public async onSelectUserAvatarFileAsync(event: any) {
    for (let file of event.files) {
      this.avatarFormData.append("formCollection", file);
    }

    await this.uploadAvatarAsync();
  };

  /**
   * Функция загружает файл изображения аватара пользователя на сервер.
   */
  private async uploadAvatarAsync() {
    let inputModel = new ProjectUserAvatarFileInput();
    inputModel.projectId = this.projectId;

    this.avatarFormData.append("uploadUserAvatarInput", JSON.stringify(inputModel));

    (await this._projectManagmentService.uploadUserAvatarFilesAsync(this.avatarFormData))
      .subscribe(async _ => {
        await this.getFileUserAvatarAsync();
      });
  };

  private async getScrumDurationSettingsAsync() {
    (await this._projectManagmentService.getScrumDurationSettingsAsync(this.projectId))
      .subscribe(async _ => {
        console.log("Настройки длительности спринтов проекта: ", this.sprintDurationSettings$.value);
        this.aScrumDurationSettings = this.sprintDurationSettings$.value;
      });
  };

  private async getProjectSprintsMoveNotCompletedTasksSettingsAsync() {
    (await this._projectManagmentService.getProjectSprintsMoveNotCompletedTasksSettingsAsync(this.projectId))
      .subscribe(async _ => {
        console.log("Настройки автоматического перемещения нерешенных задач спринта: ", this.sprintMoveNotCompletedTasksSettings$.value);
        this.aMoveNotCompletedTasksSettings = this.sprintMoveNotCompletedTasksSettings$.value;
      });
  };

  public async onUpdateScrumDurationSettingsAsync(checked: boolean, sysName: string) {
    let sprintDurationSettingInput = new SprintDurationSettingInput();
    sprintDurationSettingInput.projectId = +this.projectId;
    sprintDurationSettingInput.isSettingSelected = checked;
    sprintDurationSettingInput.sysName = sysName;

    (await this._projectManagmentService.updateScrumDurationSettingsAsync(sprintDurationSettingInput))
      .subscribe(async _ => {
        await this.getScrumDurationSettingsAsync();
      });
  }

  public async onUpdateProjectSprintsMoveNotCompletedTasksSettingsAsync(checked: boolean, sysName: string) {
    let sprintMoveNotCompletedTaskSettingInput = new SprintMoveNotCompletedTaskSettingInput();
    sprintMoveNotCompletedTaskSettingInput.projectId = +this.projectId;
    sprintMoveNotCompletedTaskSettingInput.isSettingSelected = checked;
    sprintMoveNotCompletedTaskSettingInput.sysName = sysName;

    (await this._projectManagmentService.updateProjectSprintsMoveNotCompletedTasksSettingsAsync(sprintMoveNotCompletedTaskSettingInput))
      .subscribe(async _ => {
        await this.getProjectSprintsMoveNotCompletedTasksSettingsAsync();
      });
  };

  // public onSelect(event: any) {
  //   console.log(event);
  // };

  /**
   * Функция получает список пользователей, которые состоят в проекте.
   */
  private async getSettingUsersAsync() {
    (await this._projectManagmentService.getCompanyProjectUsersAsync(+this.projectId))
      .subscribe(async _ => {
        console.log("Список пользователей: ", this.settingUsers.value);
      });
  };

  /**
   * Функция получает список ролей пользователей для настроек.
   */
  private async getUsersRolesAsync() {
    (await this._projectManagmentService.getSettingUsersRolesAsync(+this.projectId, +this.companyId))
      .subscribe(async _ => {
        console.log("Список ролей пользователей: ", this.settingUserRoles.value);
      });
  };

    /**
     * Функция отправляет для сохранения список ролей пользователей.
     */
    public async onUpdateRolesAsync(roles: any) {
    const rolesToSave: Role[] = roles.filter((e:any) => this.aUpdatedRoles.has(e.organizationMemberId))
                                     .map((e:any) => ({
                                                        userId: e.organizationMemberId,
                                                        isEnabled: e.isEnabled,
                                                        roleId: e.roleId,
                                                      }));

    const updated: UpdateRoleInput = {
      roles: rolesToSave,
      projectId: this.projectId,
      companyId: this.companyId,
    };

    (await this._projectManagmentService.updateRolesAsync(updated))
      .pipe(
        catchError(async _ => {
          console.log("Ошибка при установке ролей пользователей.");
        })
      )
      .subscribe(async _ => {
        console.log("Успешно обновили роли пользователей.");

        // если изменения ролей затрагивают текущего пользователя, то обновляем его роли
        if (this.aUpdatedRoles.has(this.currentUserId)) {
          await this.getUserRolesAsync();
        }

        this.aUpdatedRoles = new Set();
        await this.getUsersRolesAsync();
      });
  };

  public onSelectRole(userId: number) {
    this.aUpdatedRoles.add(userId);
    console.log("userId",this.aUpdatedRoles);
  };

  /**
   * Функция получает список приглашений в проект.
   */
  private async getProjectInvitesAsync() {
    (await this._projectManagmentService.getProjectInvitesAsync(+this.projectId))
      .subscribe(async _ => {
        console.log("Список приглашений: ", this.projectInvites$.value);
      });
  };


  /**
   // * Функция получает список вакансий пользователя, по которым можно пригласить пользователя в проект.
   // * @returns - Список вакансий.
   */
  private async getAvailableInviteVacanciesAsync() {
    (await this._projectService.getAvailableInviteVacanciesAsync(this.projectId))
      .subscribe(_ => {
        console.log("Доступные к приглашению в проект вакансии: ", this.availableInviteVacancies$.value);
        this.availableInviteVacancies = this.availableInviteVacancies$.value.projectVacancies;
      });
  };

  /**
   * Функция отправляет приглашение в команду проекта пользователю.
   * @param searchText - Поисковый текст.
   */
  public async onSendInviteProjectTeamAsync(searchText: string) {
    (this._searchProjectService.searchInviteProjectMembersAsync(searchText))
      .subscribe(async (response: any) => {
        this.selectedInviteUser = response.displayName;

        const inviteProjectTeamMemberInput: InviteProjectTeamMemberInput = {
          ProjectId: +this.projectId,
          InviteText: this.selectedInviteUser,
          VacancyId: !this.isVacancyInvite ? this.selectedInviteVacancy.vacancyId : null,
          InviteType: 'Email'
        };

        (await this._projectService.sendInviteProjectTeamAsync(inviteProjectTeamMemberInput))
          .subscribe(async (response: any) => {
            console.log("Добавленный в команду пользователь: ", response);

            if (!response.isAccess) {
              this.isVisibleAccessModal = true;

              return;
            }

            // TODO: Костыль для бага ререндера уведомлений.
            // TODO: Не можем отображать уведомления без обновления страницы после роута из проектов пользователя.
            this._messageService.add({ severity: 'success', summary: "Все хорошо", detail: response.successMessage });
            await this.getProjectInvitesAsync();
          });

        this.isProjectInvite = false;
      });
  };

  /**
   * Функция отменяет приглашение.
   * @param notificationId - Id уведомления.
   */
  public async onCancelProjectInviteAsync(notificationId: number) {
    (await this._projectManagmentService.cancelProjectInviteAsync(notificationId))
      .subscribe(async (_: any) => {
        await this.getProjectInvitesAsync();
      });
  };

  /**
   * Функция отменяет приглашение.
   * @param userId - Id пользователя.
   * @param isOwner - Признак владельца проекта.
   * Нужно для лечения побочного эффекта с атрибутом disabled, когда все равно по клику происходило исключение.
   */
  public async onRemoveUserProjectTeamAsync(userId: number, isOwner: boolean) {
    if (isOwner) {
      this._messageService.add({ severity: "warn", summary: "Внимание", detail: "Нельзя исключить владельца проекта." });

      return;
    }

    (await this._projectManagmentService.removeUserProjectTeamAsync(userId, +this.projectId))
      .subscribe(async (_: any) => {
        await this.getSettingUsersAsync();
      });
  };

  /**
   * Функция получает роли пользователя.
   */
  private async getUserRolesAsync() {
    (await this._projectManagmentService.getUserRolesAsync(this.projectId, this.companyId))
      .subscribe((response: any) => {
        console.log("Роли пользователя", response);
        this.aUserRoles = response;
        this.aUserRoles.forEach((e) => this.currentUserRoles.set(e.roleSysName, e.isEnabled));

        // Id пользователя
        this.currentUserId = response[0]?.organizationMemberId ?? 0;
      });
  };

  /**
   * Функция проверяет роли пользователя.
   * @param role - Роль для проверки.
   */
  private async checkUserRolesAsync(role: string | null = null): Promise<boolean> {
    if (this.aUserRoles.find((x: any) => x.roleSysName == role).isEnabled) {
      if (role == "ProjectInvite") {
        await this.getProjectInvitesAsync();
        await this.getAvailableInviteVacanciesAsync();
      }

      this.isNotRoles = false;
      this.isNotRolesAccessModal = false;
      return this.isNotRoles;
    }

    this.isNotRoles = true;
    this.isNotRolesAccessModal = true;
    return this.isNotRoles;
  };
}
