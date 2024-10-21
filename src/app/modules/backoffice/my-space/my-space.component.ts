import { Component, OnInit } from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {BackOfficeService} from "../services/backoffice.service";
import {ProjectManagmentService} from "../../project-managment/services/project-managment.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import SearchProjectResponseObject from "./search-project-response-object";

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

  aWorkspaces: SearchProjectResponseObject = {otherCompanyWorkSpaces: [], userCompanyWorkSpaces: []};
  isUserCompanyPaginator: boolean = false;
  isOtherCompanyPaginator: boolean = false;
  searchProjectForm = new FormGroup({
    isById: new FormControl(false, {nonNullable: true, validators: [Validators.required]}),
    isByProjectName: new FormControl(true, {nonNullable: true, validators: [Validators.required]}),
    searchText: new FormControl('', {nonNullable: true, validators: [Validators.required]}),
  })

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
    this.getWorkSpacesAsync();
  };

  /**
   * Функция получает все раб.пространства, в которых есть текущий пользователь.
   */
  private getWorkSpacesAsync() {
    this._projectManagmentService.getWorkSpacesAsync()
      .subscribe(_ => {
        console.log("Список раб.пространств проектов: ", this.workspaces$.value);
        this.aWorkspaces = this.workspaces$.value;
        this.isOtherCompanyPaginator = this.workspaces$.value.otherCompanyWorkSpaces.length > 10;
        this.isUserCompanyPaginator = this.workspaces$.value.userCompanyWorkSpaces.length > 10;
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

  onChangeSearchTypeSelection(isChangeId: boolean) {
    isChangeId
      ? this.searchProjectForm.controls.isByProjectName.setValue(!this.searchProjectForm.controls.isById.value)
      : this.searchProjectForm.controls.isById.setValue(!this.searchProjectForm.controls.isByProjectName.value)
  }

  onSubmitSearchForm() {
    this._projectManagmentService.getWorkspaceByCondition(this.searchProjectForm.value).subscribe(_ => {
      this.aWorkspaces = this.workspaces$.value;
      this.isOtherCompanyPaginator = this.workspaces$.value.otherCompanyWorkSpaces.length > 10;
      this.isUserCompanyPaginator = this.workspaces$.value.userCompanyWorkSpaces.length > 10;
    })
  }

  search(ev: Event) {
    if (ev.target instanceof HTMLInputElement) {
      if (ev.target.value.trim() === "") {
        this.getWorkSpacesAsync()
      }
    }
  }
}
