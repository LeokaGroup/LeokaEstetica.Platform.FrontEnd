import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ProjectService } from "../../services/project.service";
import {CatalogProjectInput} from "../../models/catalog-project-input";
import { NetworkService } from "src/app/core/interceptors/network.service";

@Component({
    selector: "",
    templateUrl: "./catalog.component.html",
    styleUrls: ["./catalog.component.scss"]
})

/**
 * Класс каталога проектов.
 */
export class CatalogProjectsComponent implements OnInit {
    constructor(private readonly _projectService: ProjectService,
        private readonly _router: Router,
        private readonly _networkService: NetworkService,
        private readonly _activatedRoute: ActivatedRoute) {
    }

    public readonly catalog$ = this._projectService.catalog$;
    public readonly pagination$ = this._projectService.pagination$;


    selectedDate: any;
    isAnyVacancies: boolean = false;
    selectedStage: any[] | null = [];
    aProjectsCatalog: any[] = [];
    page: number = 1;
    rowsCount: number = 0;
    lastId?: number | null;
    searchText: string = "";
    isShowFilter: boolean = false;
    pageLastId = new Map();
    loadingState = false;
    targetPage: number | undefined = undefined;

    aDates: any[] = [
      { name: 'По дате', key: 'Date' }
    ];
    anyVacancies: any[] = [
      { name: 'С наличием вакансий', key: 'IsAnyVacancies' }
    ];
    aStages: any[] = [
      { name: 'Идея', key: 'Concept' },
      { name: 'Поиск команды', key: 'SearchTeam' },
      { name: 'Проектирование', key: 'Projecting' },
      { name: 'Разработка', key: 'Development' },
      { name: 'Тестирование', key: 'Testing' },
      { name: 'Поиск инвесторов', key: 'SearchInvestors' },
      { name: 'Запуск', key: 'Start' },
      { name: 'Поддержка', key: 'Support' }
    ];

  public async ngOnInit() {
    this.checkUrlParams();
    this.pageLastId.set(1, 0); // lastId для первой страницы

    await this.onGetCatalogProjectsAsync();
  };


    private checkUrlParams() {
        this._activatedRoute.queryParams
        .subscribe(params => {
            console.log("params: ", params);
            this.page = params["page"] ?? 1;
            console.log("page: ", this.page);
          });
    };

    async ngDoCheck() {
      // проверка на продолжение переход по пагинации
      if (this.targetPage && !this.loadingState) {
        await this.onGetCatalogProjectsAsync();
      }
    }

    /**
     * Функция загружает список проектов для каталога.
     * Также применяет поиск и пагинацию, если они задействуются.
     * @event - опционально, если вызов из пагинации, то событие пагинации.
     */
    async onGetCatalogProjectsAsync(event?:any | null) {
      this.loadingState = true;
      this._networkService.setBusy(true);
      const stages = this.selectedStage?.map((u: any) => u.key).join(',');
      const dt = this.selectedDate ? this.selectedDate[0].key : "None";
      const catalogProjectInput: CatalogProjectInput = {
        lastId: this.lastId ?? 0,
        filters: {
          date: dt ?? 'None',
          isAnyVacancies: this.isAnyVacancies,
          stageValues: stages ?? '',
        },
        paginationRows: 20,
        searchText: this.searchText,
        isPagination: true,
      }

      // Если используем пагинацию.
      if (event) {
        const eventPage = event.page + 1;
        if (this.pageLastId.has(eventPage)) {
          this.page = eventPage;
          catalogProjectInput.lastId = this.pageLastId.get(eventPage);
        } else {
          // fast forward
          this.targetPage = eventPage;
        }
      }
      
      (await this._projectService.loadCatalogProjectsAsync(catalogProjectInput))
        .subscribe(async _ => {
          if (this.targetPage) {
            // ff
            this.page++;
            if (this.targetPage === this.page) {
              this.targetPage = undefined;
            }
          } 
          if (!this.targetPage) {
            console.log("Список проектов: ", this.catalog$.value);
            this.aProjectsCatalog = [];
            this.rowsCount = 0;
            this.lastId = 0;
            this.aProjectsCatalog = this.catalog$.value.catalogProjects;
            this.rowsCount = this.catalog$.value.total;
          }

          this.lastId = this.catalog$.value.lastId;

          // store lastId for page
          if (!this.pageLastId.has(this.page + 1)) {
            this.pageLastId.set(this.page + 1, this.catalog$.value.lastId);
          }

          if (!this.targetPage) {
            this._networkService.setBusy(false);
          }
          this.loadingState = false;
        });
    };

    /**
     * Функция сброса фильтров. 
     */
    async onResetFilters() {
      this.selectedDate = null;
      this.isAnyVacancies = false;
      this.selectedStage = null;
      this.searchText = '';
      this.isShowFilter = false;
      await this.onGetCatalogProjectsAsync();
    }

    /**
     * Функция поиска. 
     */
    async onApplyFilters() {
      this.isShowFilter = false;
      await this.onGetCatalogProjectsAsync();
    }

    /**
     * Функция переходит к проекту, который выбрали.
     * @param projectId - Id проекта.
     */
    public async onRouteSelectedProject(projectId: number) {
        this._router.navigate(["/projects/project"], {
            queryParams: {
                projectId,
                mode: "view"
            }
        });
    };
      
    showFilterDialog() {
        this.isShowFilter = true;
    }
}
