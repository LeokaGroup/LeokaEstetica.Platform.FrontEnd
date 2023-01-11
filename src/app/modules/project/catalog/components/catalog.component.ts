import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
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
        private readonly _router: Router) {
    }

    public readonly catalog$ = this._projectService.catalog$;
        
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

    public async ngOnInit() {
        forkJoin([
           await this.loadCatalogProjectsAsync()
        ]).subscribe();
    };

     /**
     * Функция загружает список вакансий для каталога.
     * @returns - Список вакансий.
     */
      private async loadCatalogProjectsAsync() {    
        (await this._projectService.loadCatalogProjectsAsync())
        .subscribe(_ => {
            console.log("Список проектов: ", this.catalog$.value);
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
}