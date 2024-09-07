import { Component, OnInit } from "@angular/core";
import { FilterVacancyInput } from "../../models/input/filter-vacancy-input";
import { VacancyService } from "../../services/vacancy.service";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
    selector: "",
    templateUrl: "./catalog-vacancy.component.html",
    styleUrls: ["./catalog-vacancy.component.scss"]
})

/**
 * Класс компонента каталога вакансий.
 */
export class CatalogVacancyComponent implements OnInit {
    constructor(private readonly _router: Router,
        private readonly _vacancyService: VacancyService,
        private readonly _activatedRoute: ActivatedRoute) { }

    public readonly catalog$ = this._vacancyService.catalog$;
    public readonly pagination$ = this._vacancyService.pagination$;

    vacancyId: number = 0;
    aSalaries: any[] = [
        { name: 'По дате', key: 'Date' },
        { name: 'По убыванию зарплат', key: 'DescSalary' },
        { name: 'По возрастанию зарплат', key: 'AscSalary' }
    ];
    selectedSalary: any;
    aPays: any[] = [
        { name: 'Не имеет значения', key: 'UnknownPay' },
        { name: 'Есть оплата', key: 'Pay' },
        { name: 'Без оплаты', key: 'NotPay' }
    ];
    selectedPay: any;
    aExperience: any[] = [
        { name: 'Не имеет значения', key: 'UnknownExperience' },
        { name: 'От 3 до 6 лет', key: 'ThreeSix' },
        { name: 'Более 6 лет', key: 'ManySix' },
        { name: 'От 1 года до 3 лет', key: 'OneThree' },
        { name: 'Нет опыта', key: 'NotExperience' }
    ];
    selectedExperience: any;
    aEmployments: any[] = [
        { name: 'Полная занятость', key: 'Full' },
        { name: 'Проектная работа', key: 'ProjectWork' },
        { name: 'Частичная занятость', key: 'Partial' }
    ];
    selectedEmployment: any[] = [];
    searchText: string = "";
    rowsCount: number = 0;
    page: number = 0;
    aCatalogVacancies: any[] = [];
    lastId?: number | null;

    // TODO: этот тип фильтра будем использовать при поиске. Вне поиска решили не делать.
    // aKeywords: any[] = [
    //     { name: 'В названии вакансии', key: 'VacancyName' },
    //     { name: 'В описании вакансии', key: 'VacancyDetail' }
    // ];
    // selectedKeyword: any;

    public async ngOnInit() {
        await this.onLoadCatalogVacanciesAsync(null);
        this.checkUrlParams();
    };

    private setUrlParams(page: number) {
        this._router.navigate(["/vacancies"], {
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
     * Функция сбрасывает фильтры
     */
    public async onResetFilters() {
      this.selectedSalary = null;
      this.selectedPay = null;
      this.selectedExperience = null;
      this.selectedEmployment = [];

      await this.onLoadCatalogVacanciesAsync(null);
    };

    /**
     * Функция переход к просмотру вакансии вне проекта.
     * @param vacancyId - Id вакансии.
     */
    public onRouteSelectedVacancy(vacancyId: number) {
        this._router.navigate(["/vacancies/vacancy"], {
            queryParams: {
                vacancyId,
                mode: "view"
            }
        });
    };

  /**
   * Функция получает списокк вакансий для каталога.
   * Применяет пагинацию, фильтры и поиск - если они задействуются.
   * @returns - Список вакансий.
   */
  public async onLoadCatalogVacanciesAsync(event: any) {
    let model = new FilterVacancyInput();
    model.Salary = this.selectedSalary ? this.selectedSalary.key : "None";

    if (this.selectedEmployment) {
      model.EmploymentsValues = this.selectedEmployment.map((u: any) => u.key).join(',');
    }

    model.Experience = this.selectedExperience ? this.selectedExperience.key : "None";
    model.Pay = this.selectedPay ? this.selectedPay.key : "None";

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
      model.searchText = event.query;
    }

    (await this._vacancyService.loadCatalogVacanciesAsync())
      .subscribe(_ => {
        console.log("Список вакансий: ", this.catalog$.value);

        this.aCatalogVacancies = [];
        this.rowsCount = 0;
        this.lastId = 0;
        this.aCatalogVacancies = this.catalog$.value.catalogVacancies;
        this.rowsCount = this.catalog$.value.total;
        this.lastId = this.catalog$.value.lastId;
      });
  };
}
