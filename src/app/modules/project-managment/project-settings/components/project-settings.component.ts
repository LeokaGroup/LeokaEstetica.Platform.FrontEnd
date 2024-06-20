import { Component, OnInit, Sanitizer } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { forkJoin } from "rxjs";
import { ProjectManagmentService } from "../../services/project-managment.service";
import {ProjectUserAvatarFileInput} from "../../task/models/input/project-user-avatar-file-input";
import {SprintDurationSettingInput} from "../../sprint/models/sprint-duration-setting-input";
import {SprintMoveNotCompletedTaskSettingInput} from "../../sprint/models/sprint-move-not-completed-task-setting-input";
import { UpdateRoleInput } from "../../models/input/update-role-input";
import { ProjectManagementSignalrService } from "src/app/modules/notifications/signalr/services/project-magement-signalr.service";
import { DomSanitizer } from "@angular/platform-browser";

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
              private readonly _router: Router,
              private readonly _activatedRoute: ActivatedRoute,
              private readonly _domSanitizer: DomSanitizer,
              private readonly _sanitizer: Sanitizer,
              private readonly _projectManagementSignalrService: ProjectManagementSignalrService) {
  }

  public readonly downloadUserAvatarFile$ = this._projectManagmentService.downloadUserAvatarFile$;
  public readonly sprintDurationSettings$ = this._projectManagmentService.sprintDurationSettings$;
  public readonly sprintMoveNotCompletedTasksSettings$ = this._projectManagmentService.sprintMoveNotCompletedTasksSettings$;
  public readonly settingUsers = this._projectManagmentService.settingUsers;
  public readonly settingUserRoles = this._projectManagmentService.settingUserRoles;

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

  items: any[] = [{
    label: 'Общие',
    items: [{
      label: 'Настройки профиля',
      command: () => {
        this.isShowProfile = true;
        this.isShowScrumSettings = false;
        this.isShowUsers = false;
        this.isShowUserRoles = false;
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

            await this.getUsersRolesAsync();
          }
        },
        {
          label: 'Приглашения',
          command: async () => {
          }
        }
      ]
    }];

  aScrumDurationSettings: any[] = [];
  aMoveNotCompletedTasksSettings: any[] = [];

  public async ngOnInit() {
    forkJoin([
      this.checkUrlParams(),
      await this.getFileUserAvatarAsync()
    ]).subscribe();

    // Подключаемся.
    this._projectManagementSignalrService.startConnection().then(() => {
      console.log("Подключились");

      this.listenAllHubsNotifications();
    });
  };

  /**
   * Функция слушает все хабы.
   */
  private listenAllHubsNotifications() {
    this._projectManagementSignalrService.listenSendNotifySuccessUpdateRoles();
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
   * Функция получает список пользователей для настроек.
   */
  private async getSettingUsersAsync() {
    (await this._projectManagmentService.getSettingUsersAsync(+this.projectId))
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
  }
}
