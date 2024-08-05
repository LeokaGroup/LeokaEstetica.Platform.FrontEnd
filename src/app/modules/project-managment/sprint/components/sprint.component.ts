import {Component, OnDestroy, OnInit} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import {ProjectManagmentService} from "../../services/project-managment.service";
import { forkJoin } from "rxjs";
import {SprintInput} from "../models/sprint-input";
import {ManualCompleteSprintInput} from "../models/manual-complete-sprint-input";

@Component({
  selector: "sprints",
  templateUrl: "./sprint.component.html",
  styleUrls: ["./sprint.component.scss"]
})

/**
 * Класс компонента спринтов.
 */
export class SprintComponent implements OnInit {
  constructor( private readonly _router: Router,
               private readonly _activatedRoute: ActivatedRoute,
               private readonly _projectManagmentService: ProjectManagmentService) { }
  public readonly sprints$ = this._projectManagmentService.sprints;

  projectId: number = 0;
  selectedSprint: any;
  projectSprintId: number = 0;
  isShowAvailableActions: boolean = false;
  aVariants: any[] = [];
  isShowAvailableSprints: boolean = false;
  selectedVariant: any;
  aAvailableSprints: any[] = [];
  selectedAvailableSprint: any;
  aNotCompletedSprintTaskIds: number[] = [];
  moveSprintName: string = "";
  isNewSprint: boolean = false;
  isNextSprint: boolean = false;

  public async ngOnInit() {
    forkJoin([
      this.checkUrlParams(),
      await this.getProjectSprintsAsync()
    ]).subscribe();
  };

  private checkUrlParams() {
    this._activatedRoute.queryParams
      .subscribe(params => {
        if (params["projectId"]) {
          this.projectId = params["projectId"];
          this.projectSprintId = params["projectSprintId"];
        }
      });
  };

  /**
   * Функция получает список спринтов.
   * @returns Список спринтов.
   */
  private async getProjectSprintsAsync() {
    (await this._projectManagmentService.getSprintsAsync(this.projectId))
      .subscribe(_ => {
        console.log("Список спринтов:", this.sprints$.value);
      });
  };

  /**
   * Функция получает выбранный спринт и переходит на страницу просмотра данных спринта.
   */
  public onSelectSprint(event: any, selectedProjectSprintId: number | null) {
    let projectSprintId

    // Берем из ивента, если выбрали чекбокс.
    if (selectedProjectSprintId == null) {
      projectSprintId = event.data.projectSprintId;
    }

    // Если кликнули по ссылкам, то берем переданный selectedProjectSprintId.
    else {
      projectSprintId = selectedProjectSprintId;
    }

    let projectId = this.projectId;
    console.log("onSelectSprint", event);

    this._router.navigate(["/project-management/sprints/sprint/details"], {
      queryParams: {
        projectId,
        projectSprintId
      }
    });
  };

  /**
   * Функция записывает данные спринта, необходимые для дальнейших действий с ним.
   * @param projectSprintId - Id спринта в рамках проекта.
   */
  public onSelectRowSprint(projectSprintId: number) {
    this.isShowAvailableActions = !this.isShowAvailableActions;

    this.projectSprintId = projectSprintId;
  };

  /**
   * Функция начинает спринт проекта.
   */
  public async onRunSprintAsync() {
    let sprintInput = new SprintInput();
    sprintInput.projectId = +this.projectId;
    sprintInput.projectSprintId = +this.projectSprintId;

    (await this._projectManagmentService.runSprintAsync(sprintInput))
      .subscribe(async _ => {
        await this.getProjectSprintsAsync();
      });
  };

  /**
   * Функция завершает спринт (ручное завершение).
   */
  public async onManualCompleteSprintAsync(isProcessed: boolean) {
    let sprintInput = new ManualCompleteSprintInput();
    sprintInput.projectId = +this.projectId;
    sprintInput.projectSprintId = +this.projectSprintId;

    // Если действие выбрано - обрабатываем его.
    if (isProcessed) {
      sprintInput.isProcessedAction = true;
      sprintInput.notCompletedSprintTaskIds = this.aNotCompletedSprintTaskIds;
      sprintInput.needSprintAction.actionVariants = this.aVariants;

      let selectedVariant = sprintInput.needSprintAction.actionVariants
        .filter((x: any) => x.variantSysName == this.selectedVariant.variantSysName)[0];
      selectedVariant.isSelected = true;

      // В будущий спринт.
      if (this.selectedVariant.variantSysName == "Prospective") {
        sprintInput.moveSprintId = +this.selectedAvailableSprint.projectSprintId;
      }

      // В новый спринт
      else if (this.selectedVariant.variantSysName == "NewSprint") {
        sprintInput.moveSprintName = this.selectedAvailableSprint.sprintName;
      }

      (await this._projectManagmentService.nanualCompleteSprintAsync(sprintInput))
        .subscribe(async (response: any) => {
          console.log(response);

          this.isShowAvailableSprints = false;
          await this.getProjectSprintsAsync();
        });
    }

    else {
      (await this._projectManagmentService.nanualCompleteSprintAsync(sprintInput))
        .subscribe(async (response: any) => {
          console.log(response);

          // Если есть незавершенные задачи у спринта, то показываем возможные действия.
          if (response.notCompletedSprintTaskIds.length > 0) {
            this.isShowAvailableSprints = true;
            this.aNotCompletedSprintTaskIds = response.notCompletedSprintTaskIds;

            if (response.needSprintAction.isNeedUserAction && !response.isProcessedAction) {
              this.aVariants = response.needSprintAction.actionVariants;

              return;
            }
          }

          await this.getProjectSprintsAsync();
        });
    }
  }

  /**
   * Функция выбирает вариант переноса незавершенных задач спринта.
   * Подготовка данных для обработки бэком при завершении спринта.
   */
  public async onSelectVariantAsync() {
    // В будущий спринт.
    if (this.selectedVariant.variantSysName == "Prospective") {
      this.isNewSprint = false;
      this.isNextSprint = true;

      (await this._projectManagmentService.getAvailableNextSprintsAsync(+this.projectId, +this.projectSprintId))
        .subscribe(async (response: any) => {
          console.log(response);

          this.aAvailableSprints = response;
        });
    }

    // В новый спринт
    else if (this.selectedVariant.variantSysName == "NewSprint") {
      this.isNewSprint = true;
      this.isNextSprint = false;
    }

    // В бэклог.
    else if (this.selectedVariant.variantSysName == "Backlog") {
      this.isNewSprint = false;
      this.isNextSprint = false;
    }
  };

  public onClosePanelMenu() {
    this._projectManagmentService.isLeftPanel = false;
  };

  public onSelectPanelMenu() {
    this._projectManagmentService.isLeftPanel = true;
  };
}
