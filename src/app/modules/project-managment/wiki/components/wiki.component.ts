import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {ProjectManagmentService} from "../../services/project-managment.service";
import {UpdateFolderNameInput} from "../../models/input/update-folder-name-input";
import {UpdateFolderPageNameInput} from "../../models/input/update-folder-page-name-input";
import {UpdateFolderPageDescriptionInput} from "../../models/input/update-folder-page-description-input";

@Component({
  selector: "wiki",
  templateUrl: "./wiki.component.html",
  styleUrls: ["./wiki.component.scss"]
})

/**
 * Класс компонента Wiki модуля УП.
 */
export class WikiComponent implements OnInit {
  constructor(private readonly _router: Router,
              private readonly _activatedRoute: ActivatedRoute,
              private readonly _projectManagmentService: ProjectManagmentService) {
  }

  public readonly wikiTreeItems$ = this._projectManagmentService.wikiTreeItems$;
  public readonly wikiTreeFolderItems$ = this._projectManagmentService.wikiTreeFolderItems$;
  public readonly wikiTreeFolderPage$ = this._projectManagmentService.wikiTreeFolderPage$;

  projectId: number = 0;
  aTreeItems: any[] = [];
  folderItems: any;
  isSelectedFolder: boolean = false;
  isSelectedFolderPage: boolean = false;
  isActiveFolderName: boolean = false;
  folderName: string = "";
  folderId: number = 0;
  isActiveFolderPageName: boolean = false;
  pageId: number = 0;
  pageName: string = "";
  pageDescription: string = "";
  isActiveFolderPageDescription: boolean = false;

  public async ngOnInit() {
    this.checkUrlParams();
    await this.getTreeAsync();
  };

  private checkUrlParams() {
    this._activatedRoute.queryParams
      .subscribe(params => {
        if (params["projectId"]) {
          this.projectId = params["projectId"];
        }
      });
  };

  /**
   * Функция получает дерево.
   */
  private async getTreeAsync() {
    (await this._projectManagmentService.getWikiTreeItemsAsync(this.projectId))
      .subscribe(_ => {
        console.log("Дерево: ", this.wikiTreeItems$.value);
        this.aTreeItems = this.wikiTreeItems$.value;
      });
  };

  /**
   * Функция ивента по элементу дерева.
   * @param e - Событие.
   */
  public async onSelectTreeItemAsync(e: any) {
    console.log(e.node);

    // Значит выбрали папку.
    if (e.node.projectId > 0) {
      this.folderId = e.node.folderId;

      (await this._projectManagmentService.getTreeItemFolderAsync(e.node.projectId, e.node.folderId))
        .subscribe(_ => {
          console.log("Выбранная папка и ее структура: ", this.wikiTreeFolderItems$.value);
          this.isSelectedFolder = true;
          this.isSelectedFolderPage = false;
          this.folderName = this.wikiTreeFolderItems$.value[0].label;
        });
    }

    // Иначе выбрали страницу.
    else {
      this.pageId = e.node.pageId;

      (await this._projectManagmentService.getTreeItemPageAsync(e.node.pageId))
        .subscribe(_ => {
          console.log("Выбранная страница: ", this.wikiTreeFolderPage$.value);
          this.isSelectedFolderPage = true;
          this.isSelectedFolder = false;
          this.pageName = this.wikiTreeFolderPage$.value.label;
          this.pageDescription = this.wikiTreeFolderPage$.value.pageDescription;
        });
    }
  }

  /**
   * Функция изменяет название папки.
   */
  public async onSaveFolderNameAsync() {
    let updateFolderNameInput = new UpdateFolderNameInput();
    updateFolderNameInput.folderId = this.folderId;
    updateFolderNameInput.folderName = this.folderName;

    (await this._projectManagmentService.updateFolderNameAsync(updateFolderNameInput))
      .subscribe(async _ => {
        (await this._projectManagmentService.getTreeItemFolderAsync(+this.projectId, this.folderId))
          .subscribe(_ => {
            console.log("Выбранная папка и ее структура: ", this.wikiTreeFolderItems$.value);
            this.folderName = this.wikiTreeFolderItems$.value[0].label;
            this.isActiveFolderName = false;
          });
      });
  };

  public onActivateFolderName() {
    this.isActiveFolderName = !this.isActiveFolderName;
  };

  /**
   * Функция изменяет название страницы папки.
   */
  public async onSaveFolderPageNameAsync() {
    let updateFolderPageNameInput = new UpdateFolderPageNameInput();
    updateFolderPageNameInput.pageId = this.pageId;
    updateFolderPageNameInput.pageName = this.pageName;

    (await this._projectManagmentService.updateFolderPageNameAsync(updateFolderPageNameInput))
      .subscribe(async _ => {
        (await this._projectManagmentService.getTreeItemPageAsync(this.pageId))
          .subscribe(_ => {
            console.log("Выбранная страница: ", this.wikiTreeFolderPage$.value);
            this.isActiveFolderPageName = false;
            this.pageName = this.wikiTreeFolderPage$.value.label;
          });
      });
  };

  public onActivateFolderPageName() {
    this.isActiveFolderPageName = !this.isActiveFolderPageName;
  };

  /**
   * Функция изменяет описание страницы папки.
   */
  public async onSaveFolderPageDescriptionAsync() {
    let updateFolderPageDescriptionInput = new UpdateFolderPageDescriptionInput();
    updateFolderPageDescriptionInput.pageId = this.pageId;
    updateFolderPageDescriptionInput.pageDescription = this.pageDescription;

    (await this._projectManagmentService.updateFolderPageDescriptionAsync(updateFolderPageDescriptionInput))
      .subscribe(async _ => {
        (await this._projectManagmentService.getTreeItemPageAsync(this.pageId))
          .subscribe(_ => {
            console.log("Выбранная страница: ", this.wikiTreeFolderPage$.value);
            this.isActiveFolderPageDescription = false;
            this.pageDescription = this.wikiTreeFolderPage$.value.pageDescription;
          });
      });
  };

  public onActivateFolderPageDescription() {
    this.isActiveFolderPageDescription = !this.isActiveFolderPageDescription;
  };
}
