import {Component, ElementRef, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {ProjectManagmentService} from "../../services/project-managment.service";
import {UpdateFolderNameInput} from "../../models/input/update-folder-name-input";
import {UpdateFolderPageNameInput} from "../../models/input/update-folder-page-name-input";
import {UpdateFolderPageDescriptionInput} from "../../models/input/update-folder-page-description-input";
import {CreateWikiFolderInput} from "../../models/input/create-folder-input";
import {ContextMenu} from "primeng/contextmenu";
import {CreateWikiPageInput} from "../../models/input/create-page-input";
import {MessageService} from "primeng/api";

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
              private readonly _projectManagmentService: ProjectManagmentService,
              private readonly _messageService: MessageService,
              private elementRef: ElementRef,
            ) {
  }

  public readonly wikiTreeItems$ = this._projectManagmentService.wikiTreeItems$;
  public readonly wikiTreeFolderItems$ = this._projectManagmentService.wikiTreeFolderItems$;
  public readonly wikiTreeFolderPage$ = this._projectManagmentService.wikiTreeFolderPage$;
  public readonly wikiContextMenu$ = this._projectManagmentService.wikiContextMenu$;
  public readonly removeFolderResponse$ = this._projectManagmentService.removeFolderResponse$;

  folderState = new Map();
  folderIdCreated:number = 0;
  projectId: number = 0;
  aTreeItems: any[] = [];
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
  selectedTreeItem: any;
  aContextMenuActions: any[] = [];
  isVisibleContextMenuAction: boolean = false;
  isCreateFolder: boolean = false;
  isCreateFolderPage: boolean = false;
  selectedFolderName: string = "";
  selectedFolderPageName: string = "";
  isParentFolder: boolean = false;
  isWithoutParentFolder: boolean = false;
  isNeedUserAction: boolean = false;

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

  ngAfterViewInit() {
    // Патч сообщения о пустом дереве - primeng не поддерживает теги в сообщении
    const element = (<HTMLElement>this.elementRef.nativeElement).querySelector('.p-tree-empty-message');
    if (element) element.innerHTML = 'Нет папок или страниц.<br />Добавьте первую папку или страницу.';
  }

  /**
   * Функция сохранения/установки состояния открытости папок.
   * @param node узел дерева
   * @param mode режим save - сохранение, restore - установка
   */
  private treeFolderState(node: any, mode: 'save'|'restore') {
    if (!node.isPage) {
      if (mode === 'save') {
        this.folderState.set(node.folderId, node.expanded)
      } else {
        node.expanded = this.folderState.has(node.folderId) ? this.folderState.get(node.folderId)
                                                            : false;
      }
    }
      
    if (node.children) {
      node.children.forEach((childNode:any) => {
        this.treeFolderState(childNode, mode);
      });
    }
  }

  /**
   * Функция получает дерево.
   */
  private async getTreeAsync() {
    (await this._projectManagmentService.getWikiTreeItemsAsync(this.projectId))
      .subscribe(_ => {
        // сохранение текущего состояния папок
        this.folderState = new Map();
        this.aTreeItems.forEach((e:any) => {
          this.treeFolderState(e, 'save');
        });
        // установка состояния папки в откртое для родителя только что созданной папки/страницы
        if (this.folderIdCreated) {
          this.folderState.set(this.folderIdCreated, true);
        }

        console.log("Дерево: ", this.wikiTreeItems$.value);
        let tempTree = this.wikiTreeItems$.value;
        tempTree = tempTree.map((e:any) => {
          if (!e.isPage) {
            if (this.folderState.size) {
              // установка сохраненного состояния папки для полученной с бэка
              this.treeFolderState(e, 'restore');
            } else {
              // установка первичного открытого состояния папок верхнего уровня 
              e.expanded = true;
            }
          }
          return e;
        });
        this.aTreeItems = tempTree;
        this.folderIdCreated = 0;
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
          this.folderName = e.node.label;
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

  /**
   * Функция отображает контекстное меню.
   * @param e - ивент.
   */
  public async onSelectContextTreeItem(e: any) {
    console.log(e);

    let _this = this; // Важно для сохранения контекста, внутри command он теряется.

    (await _this._projectManagmentService.getContextMenuAsync(e.projectId > 0 ? e.projectId : _this.projectId , e.pageId > 0 ? e.pageId : null))
      .subscribe(async _ => {
        _this.wikiContextMenu$.value.forEach((x: any) => {
          x.command = async function (e: any) {
            console.log(e);

            if (e.item.key == "CreateFolder") {
              _this.isCreateFolderPage = false;
              _this.isCreateFolder = true;
            }

            else if (e.item.key == "CreateFolderPage") {
              _this.isCreateFolder = false;
              _this.isCreateFolderPage = true;
            }

            else if (e.item.key == "RemoveFolder") {
              (await _this._projectManagmentService.removeFolderAsync(_this.selectedTreeItem.folderId, _this.removeFolderResponse$.value?.isNeedUserAction ?? false))
                .subscribe(async (_: any) => {
                  if ((_this.removeFolderResponse$.value?.isNeedUserAction ?? false)) {
                    _this.isNeedUserAction = true;
                  }

                  else {
                    _this.isNeedUserAction = false;

                    await _this.getTreeAsync();
                  }
                });
            }

            else if (e.item.key == "RemoveFolderPage") {
              await _this.removePageAsync().then(async (_: any) => {
                await _this.getTreeAsync();
              });
            }
          };
        });

        _this.aContextMenuActions = _this.wikiContextMenu$.value;
      });
  };

  /**
   * Функция создает папку.
   */
  public async onCreateFolderAsync() {
    console.log("selectedTreeItem",this.selectedTreeItem);
    this.isParentFolder = true;

    let createWikiFolderInput = new CreateWikiFolderInput();

    // Если не идет создание папки вне дерева.
    if (this.selectedTreeItem) {
      createWikiFolderInput.wikiTreeId = this.isParentFolder && !this.isWithoutParentFolder ? this.selectedTreeItem.wikiTreeId : this.aTreeItems[0].wikiTreeId;
      createWikiFolderInput.parentId = this.isParentFolder && !this.isWithoutParentFolder ? this.selectedTreeItem.folderId : null;
    }

    createWikiFolderInput.folderName = this.selectedFolderName;
    createWikiFolderInput.projectId = +this.projectId;

    (await this._projectManagmentService.createFolderAsync(createWikiFolderInput))
      .subscribe(async _ => {
        this.isParentFolder = false;

        if (!this.isWithoutParentFolder) {
          (await this._projectManagmentService.getTreeItemFolderAsync(this.selectedTreeItem.projectId, this.selectedTreeItem.folderId))
            .subscribe(async (_) => {
              this.isVisibleContextMenuAction = false;
              this.isActiveFolderPageName = false;
              this.isCreateFolder = false;
              this.folderIdCreated = createWikiFolderInput.parentId ?? 0;
              await this.getTreeAsync();
            });
        }

       else {
          this.isCreateFolder = false;
          this.isVisibleContextMenuAction = false;
          this.isActiveFolderPageName = false;
          await this.getTreeAsync();
        }
      });
  };

  /**
   * Функция создает папку или страницу вне родителя.
   * @param cm - Контекстное меню.
   * @param e - Ивент.
   */
  public async onCreateWithoutParentAsync(cm: ContextMenu, e: any) {
    this.isParentFolder = false;

    let _this = this; // Важно для сохранения контекста, внутри command он теряется.

    (await this._projectManagmentService.getContextMenuAsync(this.projectId, null, true))
      .subscribe(_ => {
        this.wikiContextMenu$.value.forEach((x: any) => {
          x.command = function (e: any) {
            console.log(e);

            if (e.item.key == "CreateFolder") {
              _this.isCreateFolder = true;
              _this.isCreateFolderPage = false;
              _this.isWithoutParentFolder = true;
            }

            else if (e.item.key == "CreateFolderPage") {
              _this.isCreateFolder = false;
              _this.isWithoutParentFolder = false;
              _this.isCreateFolderPage = true;
            }

            _this.isVisibleContextMenuAction = true;
          };
        });

        this.aContextMenuActions = this.wikiContextMenu$.value;
      });

    cm.show(e);
  };

  /**
   * Функция создает страницу.
   */
  public async onCreatePageAsync() {
    console.log("selectedTreeItem",this.selectedTreeItem);

    let createWikiPageInput = new CreateWikiPageInput();

    // Если не идет создание страницы вне дерева.
    if (this.selectedTreeItem) {
      createWikiPageInput.wikiTreeId = this.isParentFolder && !this.isWithoutParentFolder ? this.selectedTreeItem.wikiTreeId : this.aTreeItems[0].wikiTreeId;
      createWikiPageInput.parentId = this.selectedTreeItem.folderId;
    }

    createWikiPageInput.pageName = this.selectedFolderPageName;
    createWikiPageInput.projectId = +this.projectId;

    (await this._projectManagmentService.createPageAsync(createWikiPageInput))
      .subscribe(async _ => {
        this.isParentFolder = false;
        this.isVisibleContextMenuAction = false;
        this.isActiveFolderPageName = false;
        this.isCreateFolderPage = false;
        this.folderIdCreated = createWikiPageInput.parentId ?? 0;

        await this.getTreeAsync();
      });
  };

  /**
   * Функция удаляет папку.
   */
  public async onRemoveFolderAsync() {
    (await this._projectManagmentService.removeFolderAsync(this.selectedTreeItem.folderId, this.removeFolderResponse$.value?.isNeedUserAction ?? false))
      .subscribe(async (_: any) => {
        if ((this.removeFolderResponse$.value?.isNeedUserAction ?? false)) {
          this.isNeedUserAction = true;
        }

        else {
          this.isNeedUserAction = false;

          await this.getTreeAsync();
        }
      });
  };

  /**
   * Функция удаляет страницу.
   */
  private async removePageAsync() {
    (await this._projectManagmentService.removePageAsync(this.selectedTreeItem.pageId))
      .subscribe(async (_: any) => {
      });
  };
}
