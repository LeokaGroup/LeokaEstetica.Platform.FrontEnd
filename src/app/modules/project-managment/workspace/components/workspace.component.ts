import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { forkJoin } from "rxjs";
import { ProjectManagmentService } from "../../services/project-managment.service";

@Component({
  selector: "",
  templateUrl: "./workspace.component.html",
  styleUrls: ["./workspace.component.scss"]
})

/**
 * Класс компонента пространств проектов.
 */
export class WorkSpaceComponent implements OnInit {
  constructor(private readonly _projectManagmentService: ProjectManagmentService,
              private readonly _router: Router,
              private readonly _activatedRoute: ActivatedRoute) {
  }

  public readonly workspaces$ = this._projectManagmentService.workspaces$;
  public readonly projectWorkspaceSettings$ = this._projectManagmentService.projectWorkspaceSettings$;

  aWorkspaces: any[] = [];

  public async ngOnInit() {
    forkJoin([
      await this.getWorkSpacesAsync()
    ]).subscribe();
  };

  /**
   * Функция получает все раб.пространства, в которых есть текущий пользователь.
   */
  private async getWorkSpacesAsync() {
    (await this._projectManagmentService.getWorkSpacesAsync())
      .subscribe(_ => {
        console.log("Список раб.пространств проектов: ", this.workspaces$.value);
        this.aWorkspaces = this.workspaces$.value;
      });
  };

  /**
   * Функция переходит в раб.пространство проекта из общего пространства.
   * Проверка фиксации настроек проекта уже произведена ранее в компоненте хидера.
   */
  public async onRouteWorkSpaceAsync(projectId: number) {
    await this.getBuildProjectSpaceSettingsAsync(projectId);
  };

  // TODO: Дублируется.
  private async getBuildProjectSpaceSettingsAsync(projectId: number) {
    (await this._projectManagmentService.getBuildProjectSpaceSettingsAsync())
      .subscribe(_ => {
        console.log("projectWorkspaceSettings", this.projectWorkspaceSettings$.value);

        // Если настройки были зафиксированы, то переходим сразу в раб.пространство проекта.
        if (this.projectWorkspaceSettings$.value.isCommitProjectSettings) {
          // Чтобы страница прогрузилась - сделано через window.location.href.
          window.location.href = this.projectWorkspaceSettings$.value.projectManagmentSpaceUrl;
        }

        else {
          this._router.navigate(["/project-management/start"], {
            queryParams: {
              projectId
            }
          });
        }
      });
  };
}
