import {Component, DoCheck, OnInit} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { forkJoin } from "rxjs";
import { RedirectService } from "src/app/common/services/redirect.service";
import { ProjectManagmentService } from "../services/project-managment.service";

@Component({
  selector: "left-panel",
  templateUrl: "./left-panel.component.html",
  styleUrls: ["./left-panel.component.scss"]
})

/**
 * Класс компонента управления проектами (выдвижное меню - панель).
 */
export class LeftPanelComponent implements OnInit, DoCheck {
  constructor(private readonly _projectManagmentService: ProjectManagmentService,
              private readonly _router: Router,
              private readonly _redirectService: RedirectService,
              private readonly _activatedRoute: ActivatedRoute) {
  }

  public readonly headerItems$ = this._projectManagmentService.headerItems$;

  aHeaderItems: any[] = [];
  aPanelItems: any[] = [];
  selectedProjectId: number = 0;
  selectedStrategy: string = "";
  selectedTemplateId: number = 0;
  aStatuses: any[] = [];
  isLow: boolean = false;
  isMedium: boolean = false;
  isHigh: boolean = false;
  isUrgent: boolean = false;
  isBlocker: boolean = false;
  isLoading: boolean = false;
  isPanelMenu: boolean = true;
  companies: any[] = [];
  selectedCompany: any;

  public async ngOnInit() {
    forkJoin([
      this.checkUrlParams(),
      await this.getHeaderItemsAsync()
    ]).subscribe();

    this.companies = [
      {
        name: 'Компания 1',
        projects: [
          {name: 'К1 Проект 1'},
          {name: 'К1 Проект 2'}
        ]
      },
      {
        name: 'Компания 2',
        projects: [
          {name: 'К2 Проект 1'},
          {name: 'К2 Проект 2'},
          {name: 'К2 Проект 3'}
        ]
      }
    ]
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
        this.aPanelItems = this.headerItems$.value.panelItems;
      });
  };

  private async checkUrlParams() {
    this._activatedRoute.queryParams
      .subscribe(async params => {
        this.selectedProjectId = params["projectId"];
        this.selectedStrategy = params["view"];
        this.selectedTemplateId = params["tm"];
      });
  };

  /**
   * Функция обработки выбранного пункта меню модуля УП.
   * @param event - Событие.
   */
  public async onSelectMenu(event: MouseEvent) {
    if (!(event.target instanceof HTMLElement)) return;

    console.log("onSelectMenu", event.target?.textContent);

    const selectedValue = event.target?.textContent;
    const projectId = this.selectedProjectId;

    // Переход к бэклогу проекта.
    switch (selectedValue) {
      case "Бэклог":
        this._router.navigate(["/project-management/space/backlog"], {
          queryParams: {
            projectId
          }
        });
        this.onClose();
        break;

      case "Спринты":
        this._router.navigate(["/project-management/sprints"], {
          queryParams: {
            projectId
          }
        });
        this.onClose();
        break;

      case "Задачи":
        this._router.navigate(["/project-management/space"], {
          queryParams: {
            projectId
          }
        });
        this.onClose();
        break;

      case "Пространства":
        this._router.navigate(["/project-management/workspaces"]);
        this.onClose();
        break;

      case "Wiki":
        this._router.navigate(["/project-management/wiki"], {
          queryParams: {
            projectId
          }
        });
        this.onClose();
        break;

      default:
        break;
    }
  };

  ngDoCheck() {
    if (this._projectManagmentService.isLeftPanel) {
      this.isPanelMenu = true;
    }
    else {
      this.isPanelMenu = true;
    }
    
    // отключаем Спринты, если не выбран проект
    const disableButtonSprints = this._router.url.indexOf(`projectId=${this.selectedProjectId}`) < 0;
    this.disableButtonIfNeeded('Sprints', disableButtonSprints);
    this.disableButtonIfNeeded('Backlog', disableButtonSprints);
  };

  /**
   * Функция отключает кнопку панели, если не выбран проект.
   */
  private disableButtonIfNeeded(buttonId: string, disabled: boolean) {
    const button = this.findButton(buttonId);
    if (button) {
      button.disabled = disabled;
    }
  }

  /**
   * Функция ищет необходимый элемент панели.
   * @returns - искомый элемент панели.
   */
  private findButton = (id: string) => {
    return this.aPanelItems[0].items.find((item: any) => item.id === id);
  }

  public onClose() {
    this._projectManagmentService.isLeftPanel = false;
  };

  public onSelectCompany() {
    console.log(this.selectedCompany.projects[0]);
    console.log(this.aPanelItems[0].items);
  }
}
