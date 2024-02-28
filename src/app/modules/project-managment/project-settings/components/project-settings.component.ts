import { Component, OnInit, Sanitizer } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { ActivatedRoute, Router } from "@angular/router";
import { forkJoin } from "rxjs";
import { RedirectService } from "src/app/common/services/redirect.service";
import { ProjectManagmentService } from "../../services/project-managment.service";
import {ProjectTaskFileInput} from "../../task/models/input/project-task-file-input";
import {ProjectUserAvatarFileInput} from "../../task/models/input/project-user-avatar-file-input";

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

  projectId: number = 0;
  userAvatarLink: any;
  isShowProfile: boolean = false;
  avatarFormData = new FormData();

  items: any[] = [{
    label: 'Общие',
    items: [{
      label: 'Настройки профиля',
      command: () => {
        this.isShowProfile = true;
      }
    }
    ]
  }];

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

          const a = document.createElement('a');
          a.setAttribute('type', 'hidden');
          a.href = URL.createObjectURL(this.downloadUserAvatarFile$.value.body);
          this.userAvatarLink = this._domSanitizer.bypassSecurityTrustUrl(a.href);

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
}
