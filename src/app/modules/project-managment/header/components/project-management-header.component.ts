import {Component, DoCheck, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {forkJoin} from "rxjs";
import {ProjectManagmentService} from "../../services/project-managment.service";
import {FixationStrategyInput} from "../../task/models/input/fixation-strategy-input";

@Component({
  selector: "project-management-header",
  templateUrl: "./project-management-header.component.html",
  styleUrls: ["./project-management-header.component.scss"]
})

/**
 * Класс модуля управления проектами (хидера).
 */
export class ProjectManagementHeaderComponent implements OnInit, DoCheck {
  constructor(private readonly _projectManagmentService: ProjectManagmentService,
              private readonly _router: Router,
              private readonly _activatedRoute: ActivatedRoute) {
  }

  public readonly headerItems$ = this._projectManagmentService.headerItems$;

  projectId: number = 0;
  projectTaskId: number = 0;
  aHeaderItems: any[] = [];
  home: string = "project name";
  items: any[] = [
    {
      label: "[Тут будет название проекта]"
    }
  ];

  public async ngOnInit() {
    forkJoin([
      this.checkUrlParams(),
      await this.getHeaderItemsAsync()
    ]).subscribe();
  };

  ngDoCheck() {
    // Если роут не Kanban или Scrum, то дизейблим пункт меню стратегия представления.
    if (this._router.url !== "/project-management/space?projectId=274") {
      this.aHeaderItems[0].disabled = true;
    }

    else {
      this.aHeaderItems[0].disabled = false;
    }
  };

  private async checkUrlParams() {
    this._activatedRoute.queryParams
      .subscribe(async params => {
        console.log("params: ", params);

        this.projectId = params["projectId"];
      });
  };

  /**
   * Функция получает список элементов меню хидера (верхнее меню).
   * @returns - Список элементов.
   */
  private async getHeaderItemsAsync() {
    (await this._projectManagmentService.getHeaderItemsAsync())
      .subscribe(_ => {
        console.log("Хидер УП: ", this.headerItems$.value);
        this.aHeaderItems = this.headerItems$.value;
      });
  };

  /**
   * Функция обработки выбранного пункта меню модуля УП.
   * @param event - Событие.
   */
  public async onSelectMenu(event: any) {
    let selectedValue = event.target.textContent;
    let projectId = this.projectId;

    this.aHeaderItems.forEach((firstLevel: any) => {
      // Если первый уровень выбран, то проверяем доступность тут.
      if (firstLevel.label == selectedValue) {
        // Не пускаем дальше если стоит блокировка пункта.
        if (!firstLevel.disabled) {
          return;
        }
      }

      // Если на первом уровне не нашли, смотрим еще ниже.
      if (firstLevel.label !== selectedValue) {
        firstLevel.forEach((secondLevel: any) => {
          // Не пускаем дальше если стоит блокировка пункта.
          if (!secondLevel.disabled) {
            return;
          }
        });
      }
    });

    // Переход к созданию задачи.
    switch (selectedValue) {
      case "Настройки":
        break;

      case "Задачу":
        this._router.navigate(["/project-management/space/create"], {
          queryParams: {
            projectId
          }
        });
        break;

      case "Настройки представлений":
        this._router.navigate(["/project-management/space/view-settings"], {
          queryParams: {
            projectId
          }
        });
        break;

      case "Настройки проекта":
        this._router.navigate(["/project-management/space/project-settings"], {
          queryParams: {
            projectId
          }
        });
        break;

      case "Scrum (список)":
        let fixationScrumInput = new FixationStrategyInput();
        fixationScrumInput.projectId = projectId;
        fixationScrumInput.strategySysName = "Scrum";

        (await this._projectManagmentService.fixationSelectedViewStrategyAsync(fixationScrumInput))
          .subscribe(_ => {
            window.location.reload();
          });

        break;

      case "Kanban (доска)":
        let fixationKanbanInput = new FixationStrategyInput();
        fixationKanbanInput.projectId = projectId;
        fixationKanbanInput.strategySysName = "Kanban";

        (await this._projectManagmentService.fixationSelectedViewStrategyAsync(fixationKanbanInput))
          .subscribe(_ => {
            window.location.reload();
          });

        break;
      default:
        console.error(`Неизвестный тип события: ${selectedValue}`);
    }
  };
}
