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
    selectedStage: any[] | null = [];
    // searchText: string = "";
    aProjectsCatalog: any[] = [];
    page: number = 0;
    rowsCount: number = 0;
    lastId?: number | null;
    searchText: string = "";
    vacancyOptions = [
      { label: 'С наличием вакансий', value: true }
    ];
    dateOptions = [
      { label: 'По дате', value: 'Date' }
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

    await this.onGetCatalogProjectsAsync(null);
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
     * Функция загружает список проектов для каталога.
      * Также применяет поиск и пагинацию, если они задействуются.
     * @returns - Список проектов.
     */
     public async onGetCatalogProjectsAsync(event: any) {
       let catalogProjectInput = new CatalogProjectInput();
       catalogProjectInput.date = this.selectedDate ? this.selectedDate[0].key : "None";

       if (this.selectedStage) {
         catalogProjectInput.stageValues = this.selectedStage.join(',');
       }

       catalogProjectInput.isAnyVacancies = this.isAnyVacancies;
       catalogProjectInput.paginationRows = 20;
       catalogProjectInput.lastId = this.lastId;

       // Если используем пагинацию на ините.
       if (this.page == 0 && event !== null) {
         this.setUrlParams(event.page + 1); // Надо инкрементить, так как event.page по дефолту имеет 0 для 1 элемента.
       }

       // Если используем пагинацию после 1 страницы.
       else if (event !== null) {
         this.page = +this.page + 1;
       }

       // Если используем поиск.
       if (event !== null && event.query) {
         this.searchText = event.query;
         catalogProjectInput.searchText = this.searchText;
       }

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
    public async onResetFiltersAsync() {
      this.selectedDate = null;
      this.isAnyVacancies = false;
      this.selectedStage = null;

      await this.onGetCatalogProjectsAsync(null);
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
}
