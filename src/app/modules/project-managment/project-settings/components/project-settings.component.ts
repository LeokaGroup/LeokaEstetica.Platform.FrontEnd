import { Component, OnInit, Sanitizer } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { ActivatedRoute, Router } from "@angular/router";
import { forkJoin } from "rxjs";
import { RedirectService } from "src/app/common/services/redirect.service";
import { ProjectManagmentService } from "../../services/project-managment.service";
import {ProjectUserAvatarFileInput} from "../../task/models/input/project-user-avatar-file-input";
import {SprintDurationSettingInput} from "../../sprint/models/sprint-duration-setting-input";
import {SprintMoveNotCompletedTaskSettingInput} from "../../sprint/models/sprint-move-not-completed-task-setting-input";

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
              private readonly _redirectService: RedirectService,
              private readonly _activatedRoute: ActivatedRoute,
              private readonly _domSanitizer: DomSanitizer,
              private readonly _sanitizer: Sanitizer) {
  }

  public readonly downloadUserAvatarFile$ = this._projectManagmentService.downloadUserAvatarFile$;
  public readonly sprintDurationSettings$ = this._projectManagmentService.sprintDurationSettings$;
  public readonly sprintMoveNotCompletedTasksSettings$ = this._projectManagmentService.sprintMoveNotCompletedTasksSettings$;

  projectId: number = 0;
  userAvatarLink: any;
  isShowProfile: boolean = false;
  avatarFormData = new FormData();
  isShowScrumSettings: boolean = false;
  selectedDurationSetting: any;
  selectedMoveSetting: any;
  checked: boolean = true;

  items: any[] = [{
    label: 'Общие',
    items: [{
      label: 'Настройки профиля',
      command: () => {
        this.isShowProfile = true;
        this.isShowScrumSettings = false;
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

          await this.getScrumDurationSettingsAsync();
          await this.getProjectSprintsMoveNotCompletedTasksSettingsAsync();
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
}
