import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { forkJoin } from "rxjs";
import { FilterProjectInput } from "../../detail/models/input/filter-project-input";
import { ProjectService } from "../../services/project.service";

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
        
    aDates: any[] = [
        { name: 'По дате', key: 'Date' }
    ];
    selectedDate: any;
    anyVacancies: any[] = [
        { name: 'С наличием вакансий', key: 'IsAnyVacancies' }
    ];
    isAnyVacancies: boolean = false;
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
    selectedStage: any;
    searchText: string = "";
    aProjectsCatalog: any[] = [];
    page: number = 0;
    rowsCount: number = 0;

    public async ngOnInit() {
        forkJoin([
           await this.loadCatalogProjectsAsync(),
           this.checkUrlParams(),
           await this.initVacanciesPaginationAsync()
        ]).subscribe();
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
      private async loadCatalogProjectsAsync() {    
        (await this._projectService.loadCatalogProjectsAsync())
        .subscribe(_ => {
            console.log("Список проектов: ", this.catalog$.value);
            this.aProjectsCatalog = this.catalog$.value.catalogProjects;
            this.rowsCount = this.catalog$.value.total;
        });
    };

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
     * Функция фильтрует проекты по соответствию.
     * @returns - Список проектов после фильтрации.
     */
     public async onFilterProjectsAsync() {
        let filterProjectInput = this.createFilterProjectResult();
        console.log(filterProjectInput);

        (await this._projectService.filterProjectsAsync(filterProjectInput))
        .subscribe(_ => {
            console.log("Список проектов после фильтрации: ", this.catalog$.value);
            this.aProjectsCatalog = [];
            this.rowsCount = 0;
            this.aProjectsCatalog = this.catalog$.value;
            this.rowsCount = this.catalog$.value.length;
        });
    };

    /**
     * Функция создает входную модель фильтров проектов.
     * @returns - Входная модель.
     */
     private createFilterProjectResult(): FilterProjectInput {
        let model = new FilterProjectInput();
        model.Date = this.selectedDate ? this.selectedDate[0].key : "None";

        if (this.selectedStage) {
            model.StageValues = this.selectedStage.map((u : any) => u.key).join(','); 
        }
              
        model.IsAnyVacancies = this.isAnyVacancies;

        return model;
    };

    /**
     * Функция ищет проекты по поисковому запросу.
     * @param searchText - Поисковая строка.
     * @returns - Список проектов после поиска.
     */
   public async onSearchProjectsAsync(event: any) {
    (await this._projectService.searchProjectsAsync(event.query))
    .subscribe(_ => {
        console.log("Результаты поиска: ", this.catalog$.value);
        this.aProjectsCatalog = this.catalog$.value.catalogProjects;
    });
   };

    public async onLoadCatalogProjectsAsync() {
        await this.loadCatalogProjectsAsync();
    };

    /**
     * Функция пагинации проектов.
     * @param page - Номер страницы.
     * @returns - Список проектов.
     */
     public async onGetProjectsPaginationAsync(event: any) {                
        console.log(event);
        (await this._projectService.getProjectsPaginationAsync(event.page))
            .subscribe(_ => {
                console.log("Пагинация: ", this.pagination$.value), "page: " ;
                this.setUrlParams(event.page + 1); // Надо инкрементить, так как event.page по дефолту имеет 0 для 1 элемента.
                this.aProjectsCatalog = this.pagination$.value.projects;
            });
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