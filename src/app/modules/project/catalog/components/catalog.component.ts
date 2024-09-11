import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { forkJoin } from "rxjs";
import { ProjectService } from "../../services/project.service";
import {CatalogProjectInput} from "../../models/catalog-project-input";
import {FilterProjectInput} from "../../detail/models/input/filter-project-input";

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
        private readonly _activatedRoute: ActivatedRoute) {
    }

    public readonly catalog$ = this._projectService.catalog$;
    public readonly pagination$ = this._projectService.pagination$;


    selectedDate: any;
    isAnyVacancies: boolean = false;
    selectedStage: any;
    // searchText: string = "";
    aProjectsCatalog: any[] = [];
    page: number = 0;
    rowsCount: number = 0;
    lastId?: number | null;
    vacancyOptions = [
      { label: 'Только с открытыми', value: true },
      { label: 'Все проекты', value: false }
    ];
    dateOptions = [
      { label: 'Любое время', value: 'all' },
      { label: 'За месяц', value: 'month' },
      { label: 'За неделю', value: 'week' },
      { label: 'За 2 дня', value: '2days' }
    ];
    stageOptions = [
      { label: 'Идея', value: 'Concept' },
      { label: 'Поиск команды', value: 'SearchTeam' },
      { label: 'Проектирование', value: 'Projecting' },
      { label: 'Разработка', value: 'Development' },
      { label: 'Тестирование', value: 'Testing' },
      { label: 'Поиск инвесторов', value: 'SearchInvestors' },
      { label: 'Запуск', value: 'Start' },
      { label: 'Поддержка', value: 'Support' }
    ];

  public async ngOnInit() {
    this.checkUrlParams();
    await this.onLoadCatalogProjectsAsync();
    await this.initVacanciesPaginationAsync();
  };

    private setUrlParams(page: number) {
        this._router.navigate(["/projects"], {
            queryParams: {
                page: page
            }
        });
    };

    private checkUrlParams() {
        this._activatedRoute.queryParams
        .subscribe(params => {
            console.log("params: ", params);
            this.page = params["page"]
            console.log("page: ", this.page);
          });
    };

     /**
     * Функция загружает список вакансий для каталога.
     * @returns - Список вакансий.
     */
     public async onLoadCatalogProjectsAsync() {
       let catalogProjectInput = new CatalogProjectInput();
       catalogProjectInput.date = this.selectedDate ? this.selectedDate[0].value : "None";

       if (this.selectedStage) {
         catalogProjectInput.stageValues = this.selectedStage
       }

       catalogProjectInput.isAnyVacancies = this.isAnyVacancies;
       catalogProjectInput.paginationRows = 20;
       catalogProjectInput.lastId = this.lastId;

       (await this._projectService.loadCatalogProjectsAsync(catalogProjectInput))
         .subscribe(_ => {
           console.log("Список проектов: ", this.catalog$.value);

           this.aProjectsCatalog = [];
           this.rowsCount = 0;
           this.lastId = 0;
           this.aProjectsCatalog = this.catalog$.value.catalogProjects;
           this.rowsCount = this.catalog$.value.total;
           this.lastId = this.catalog$.value.lastId;
         });
     };

    /**Функция сброса фильтров. */
    // public async onResetFiltersAsync() {
    //   this.selectedDate = null;
    //   this.isAnyVacancies = false;
    //   this.selectedStage = null;

    //   await this.onLoadCatalogProjectsAsync();
    // }

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

    /**
     * Функция ищет проекты по поисковому запросу.
     * @param searchText - Поисковая строка.
     * @returns - Список проектов после поиска.
     */
    // public async onSearchProjectsAsync(event: any) {
    //   this.searchText = event.query;
    //   (await this._projectService.searchProjectsAsync(event.query))
    //     .subscribe(_ => {
    //       console.log("Результаты поиска: ", this.catalog$.value);

    //       this.aProjectsCatalog = [];
    //       this.rowsCount = 0;
    //       this.lastId = 0;
    //       this.catalog$.value.total = null;
    //       this.rowsCount = this.catalog$.value.catalogProjects.length;
    //       this.lastId = this.catalog$.value.lastId;
    //       this.aProjectsCatalog = this.catalog$.value.catalogProjects;
    //     });
    // };

    /**
     * Функция пагинации проектов.
     * @param page - Номер страницы.
     * @returns - Список проектов.
     */
     public async onGetProjectsPaginationAsync(event: any) {
      this.setUrlParams(event.page + 1); // Надо инкрементить, так как event.page по дефолту имеет 0 для 1 элемента.
      this.page = +this.page + 1;
      await this.onLoadCatalogProjectsAsync();
    };

    /**
     * Функция инициализации пагинации.
     */
     private async initVacanciesPaginationAsync() {
        (await this._projectService.getProjectsPaginationAsync(0))
            .subscribe(_ => {
                console.log("Пагинация: ", this.pagination$.value), "page: " + this.page;
                this.setUrlParams(1);
            });
    };
}
