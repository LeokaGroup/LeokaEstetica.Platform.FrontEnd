import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { forkJoin } from "rxjs";
import { ProjectManagmentService } from "../../services/project-managment.service";
import {ProjectUserAvatarFileInput} from "../../task/models/input/project-user-avatar-file-input";
import {SprintDurationSettingInput} from "../../sprint/models/sprint-duration-setting-input";
import {SprintMoveNotCompletedTaskSettingInput} from "../../sprint/models/sprint-move-not-completed-task-setting-input";
import { UpdateRoleInput } from "../../models/input/update-role-input";
import { DomSanitizer } from "@angular/platform-browser";
import {ProjectService} from "../../../project/services/project.service";
import {SearchProjectService} from "../../../search/services/search-project-service";
import {InviteProjectTeamMemberInput} from "../../../project/detail/models/input/invite-project-team-member-input";
import {MessageService} from "primeng/api";
import {AccessService} from "../../../access/access.service";

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
  userAvatarLink: any;
  isShowProfile: boolean = false;
  avatarFormData = new FormData();
  isShowScrumSettings: boolean = false;
  checked: boolean = true;
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

            await this.checkUserRolesAsync("ProjectInvite");
          }
        }
      ]
    }];

  aScrumDurationSettings: any[] = [];
  aMoveNotCompletedTasksSettings: any[] = [];
  aProjectInviteVarians: any[] = [
    // { name: 'По ссылке', key: 'Link' },
    { name: 'По почте', key: 'Email' },
    // { name: 'По номеру телефона', key: 'PhoneNumber' },
    { name: 'По логину', key: 'Login' }
  ];
  selectedInviteVariant: any;
  availableInviteVacancies: any[] = [];
  selectedInviteVacancy: any;
  isVacancyInvite: boolean = false;
  searchText: string = "";
  aProjectInvitesUsers: any[] = [];
  selectedInviteUser: string = "";
  isVisibleAccessModal = false;
  isInviteRole: boolean = false;
  featureForbiddenText: string = "";
  isNotRoles: boolean = false;
  aUserRoles: any[] = [];
  isNotRolesAccessModal: boolean = false;

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

  public async onUpdateScrumDurationSettingsAsync(checked: boolean, sysName: string, i: number) {
    let sprintDurationSettingInput = new SprintDurationSettingInput();
    sprintDurationSettingInput.projectId = +this.projectId;
    sprintDurationSettingInput.isSettingSelected = checked;
    sprintDurationSettingInput.sysName = sysName;

    (await this._projectManagmentService.updateScrumDurationSettingsAsync(sprintDurationSettingInput))
      .subscribe(async _ => {
        await this.getScrumDurationSettingsAsync();
      });
  }

  public async onUpdateProjectSprintsMoveNotCompletedTasksSettingsAsync(checked: boolean, sysName: string, i: number) {
    let sprintMoveNotCompletedTaskSettingInput = new SprintMoveNotCompletedTaskSettingInput();
    sprintMoveNotCompletedTaskSettingInput.projectId = +this.projectId;
    sprintMoveNotCompletedTaskSettingInput.isSettingSelected = checked;
    sprintMoveNotCompletedTaskSettingInput.sysName = sysName;

    (await this._projectManagmentService.updateProjectSprintsMoveNotCompletedTasksSettingsAsync(sprintMoveNotCompletedTaskSettingInput))
      .subscribe(async _ => {
        await this.getProjectSprintsMoveNotCompletedTasksSettingsAsync();
      });
  };

  public onSelect(event: any) {
    console.log(event);
  };

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
    (await this._projectManagmentService.getSettingUsersRolesAsync(+this.projectId))
      .subscribe(async _ => {
        console.log("Список ролей пользователей: ", this.settingUserRoles.value);
      });
  };

  public async onUpdateRolesAsync(roles: any) {
    let updated: UpdateRoleInput[] = [];
    roles.forEach((x: any) => {
      if (this.aUpdatedRoles.has(x.organizationMemberId)) {
        let obj = new UpdateRoleInput();
        obj.userId = x.organizationMemberId;
        obj.isEnabled = x.isEnabled;
        obj.roleId = x.roleId;

        updated.push(obj);
      }
    });

    (await this._projectManagmentService.updateRolesAsync(updated))
      .subscribe(async _ => {
        console.log("спешно обновили роли пользователей.");
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
    this.selectedInviteUser = event.value.displayName;
  };

  /**
   * Функция отправляет приглашение в команду проекта пользователю.
   */
  public async onSendInviteProjectTeamAsync() {
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

          return ;
        }

        // TODO: Костыль для бага ререндера уведомлений.
        // TODO: Не можем отображать уведомления без обновления страницы после роута из проектов пользователя.
        this._messageService.add({ severity: 'success', summary: "Все хорошо", detail: response.successMessage });
      });
    await this.getProjectInvitesAsync();
    this.isProjectInvite = false;
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
    (await this._projectManagmentService.getUserRolesAsync(+this.projectId, +this._projectManagmentService.companyId))
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
