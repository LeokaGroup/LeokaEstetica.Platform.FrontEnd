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
  isPanelMenu: boolean = false;

  public async ngOnInit() {
    forkJoin([
      this.checkUrlParams(),
      await this.getHeaderItemsAsync()
    ]).subscribe();
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
  public async onSelectMenu(event: any) {
    console.log("onSelectMenu", event.target.textContent);

    let selectedValue = event.target.textContent;
    let projectId = this.selectedProjectId;

    // Переход к бэклогу проекта.
    switch (selectedValue) {
      case "Бэклог":
        this._router.navigate(["/project-management/space/backlog"], {
          queryParams: {
            projectId
          }
        });
        break;
    }
  };

  ngDoCheck() {
   if (this._projectManagmentService.isLeftPanel) {
     this.isPanelMenu = true;
   }
   else {
     this.isPanelMenu = false;
   }
  };

  public onClose() {
    this._projectManagmentService.isLeftPanel = false;
  };
}
