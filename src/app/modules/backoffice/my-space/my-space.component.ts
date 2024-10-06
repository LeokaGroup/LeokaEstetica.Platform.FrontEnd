import { Component, OnInit } from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {BackOfficeService} from "../services/backoffice.service";
import {ProjectManagmentService} from "../../project-managment/services/project-managment.service";

@Component({
  selector: "my-space",
  templateUrl: "./my-space.component.html",
  styleUrls: ["./my-space.component.scss"]
})

/**
 * Класс компонента пространства пользователя ("Мое пространство").
 */
export class MySpaceComponent implements OnInit {
  constructor(private readonly _backOfficeService: BackOfficeService,
              private readonly _router: Router,
              private readonly _projectManagmentService: ProjectManagmentService,
              private readonly _activatedRoute: ActivatedRoute) {
  }

  public readonly workspaces$ = this._projectManagmentService.workspaces$;
  public readonly projectWorkspaceSettings$ = this._projectManagmentService.projectWorkspaceSettings$;

  aWorkspaces: any[] = [];
  isPaginator: boolean = false;

  items = [
    {
      label: 'Refresh',
      icon: 'pi pi-refresh'
    },
    {
      label: 'Search',
      icon: 'pi pi-search'
    },
    {
      separator: true
    },
    {
      label: 'Delete',
      icon: 'pi pi-times'
    }
  ];

  public async ngOnInit() {
    await this.getWorkSpacesAsync();
  };

  /**
   * Функция получает все раб.пространства, в которых есть текущий пользователь.
   */
  private async getWorkSpacesAsync() {
    (await this._projectManagmentService.getWorkSpacesAsync())
      .subscribe(_ => {
        console.log("Список раб.пространств проектов: ", this.workspaces$.value);
        this.aWorkspaces = this.workspaces$.value;
        this.isPaginator = this.workspaces$.value.length > 0;
      });
  };

  /**
   * Функция переходит в раб.пространство проекта из общего пространства.
   * Проверка фиксации настроек проекта уже произведена ранее в компоненте хидера.
   * @param projectId - Id проекта.
   * @param companyId - Id компании.
   */
  public async onRouteWorkSpaceAsync(projectId: number, companyId: number) {
    await this.getBuildProjectSpaceSettingsAsync(projectId, companyId);
  };

  // TODO: Дублируется.
  private async getBuildProjectSpaceSettingsAsync(projectId: number, companyId: number) {
    (await this._projectManagmentService.getBuildProjectSpaceSettingsAsync(projectId, companyId))
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
              projectId,
              companyId
            }
          });
        }
      });
  };
}
