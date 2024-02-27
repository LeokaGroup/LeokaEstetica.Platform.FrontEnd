import { Component, OnInit, Sanitizer } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { ActivatedRoute, Router } from "@angular/router";
import { forkJoin } from "rxjs";
import { RedirectService } from "src/app/common/services/redirect.service";
import { ProjectManagmentService } from "../../services/project-managment.service";

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

  public async ngOnInit() {
    forkJoin([
      this.checkUrlParams(),
      await this.downloadFileUserAvatarAsync()
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
  private async downloadFileUserAvatarAsync() {
    return new Promise(async resolve => {
      (await this._projectManagmentService.downloadFileUserAvatarAsync(+this.projectId))
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
}
