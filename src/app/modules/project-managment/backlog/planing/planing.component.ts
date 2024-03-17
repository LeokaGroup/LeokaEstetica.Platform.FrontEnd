import {Component, OnInit} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { forkJoin } from "rxjs";
import { RedirectService } from "src/app/common/services/redirect.service";
import { ProjectManagmentService } from "../../services/project-managment.service";
import {PrimeNGConfig} from "primeng/api";
import {TranslateService} from "@ngx-translate/core";
import {PlaningSprintInput} from "../../task/models/input/planing-sprint-input";

@Component({
  selector: "",
  templateUrl: "./planing.component.html",
  styleUrls: ["./planing.component.scss"]
})

/**
 * Класс компонента спринтов (планирование спринта).
 */
export class PlaningSprintComponent implements OnInit {
  constructor(private readonly _projectManagmentService: ProjectManagmentService,
              private readonly _router: Router,
              private readonly _redirectService: RedirectService,
              private readonly _activatedRoute: ActivatedRoute,
              private _config: PrimeNGConfig,
              private _translateService: TranslateService) {
  }

  public readonly sprintTasks = this._projectManagmentService.sprintTasks;

  selectedProjectId: number = 0;
  isLoading: boolean = false;
  sprintName: string = "";
  sprintDescription: string = "";
  isSprintDates: boolean = false;
  locale: any;
  dateStart: any = null;
  dateEnd: any = null;
  isSprintTasks: boolean = false;

  public async ngOnInit() {
    this._projectManagmentService.isLeftPanel = false;

    forkJoin([
      this.checkUrlParams()
    ]).subscribe();

    this._translateService.setDefaultLang('ru');
    this.translate('ru');
    this.locale = this._translateService.getDefaultLang();
  };

  translate(lang: string) {
    this._translateService.use(lang);
    this._translateService.get('primeng').subscribe(res => this._config.setTranslation(res));
  }

  private async checkUrlParams() {
    this._activatedRoute.queryParams
      .subscribe(async params => {
        this.selectedProjectId = params["projectId"];
      });
  };

  public onSelectPanelMenu() {
    console.log("onSelectPanelMenu");
    this._projectManagmentService.isLeftPanel = true;
  };

  public onSelectTaskLink(fullTaskId: string) {
    let projectId = this.selectedProjectId;

    this._router.navigate(["/space/details"], {
      queryParams: {
        projectId,
        taskId: fullTaskId
      }
    });
  };

  /**
   * Функция планирует спринт.
   * Добавляет задачи в спринт, если их указали при планировании спринта.
   */
  public async onPlaningSprintAsync() {
    let planingSprintInput = new PlaningSprintInput();
    planingSprintInput.projectId = this.selectedProjectId;
    planingSprintInput.sprintName = this.sprintName;
    planingSprintInput.sprintDescription = this.sprintDescription;

    if (this.dateStart !== null
      && this.dateStart !== undefined
      && this.dateEnd !== null
      && this.dateEnd !== undefined) {
      planingSprintInput.dateStart = this.dateStart;
      planingSprintInput.dateEnd = this.dateEnd;
    }

    (await this._projectManagmentService.planingSprintAsync(planingSprintInput))
      .subscribe(async (_: any) => {});
  };
}
