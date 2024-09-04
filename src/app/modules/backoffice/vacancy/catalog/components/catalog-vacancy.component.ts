import { Component, OnInit } from "@angular/core";
import { FilterVacancyInput } from "../../models/input/filter-vacancy-input";
import { VacancyService } from "../../services/vacancy.service";
import { ActivatedRoute, Router } from "@angular/router";
import { FormArray, FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { debounceTime } from "rxjs";
import { vacancyCatalogInput } from "../../models/input/catalog-input";


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
        private readonly _activatedRoute: ActivatedRoute,
        private fb: FormBuilder) { }

    form!: FormGroup;

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
    rowsCount: number = 0;
    page: number = 0;
    aCatalogVacancies: any[] = [];

    // TODO: этот тип фильтра будем использовать при поиске. Вне поиска решили не делать.
    // aKeywords: any[] = [
    //     { name: 'В названии вакансии', key: 'VacancyName' },
    //     { name: 'В описании вакансии', key: 'VacancyDetail' }
    // ];
    // selectedKeyword: any;

    public async ngOnInit() {
        this.checkUrlParams();
        this.initForm();
    };

    /**
     * Функция получения массива контролов employments формы.
     */ 
    get employmentsArray() {
        return this.form.controls['employments'] as FormArray;
    }

    /**
     * Функция инициализирует форму поиска и фильтров.
     */    
    initForm() {
        this.form = this.fb.group({
            salary: '',
            pay: '',
            experience: '',
            employments: this.fb.array([]),
            searchText: ''
        });
        this.aEmployments.forEach(() => this.employmentsArray.push(new FormControl([])));
        this.formSubscribe();
        this.setDefaultFilters();
    }

    /**
     * Функция создает подписку на изменение данных формы поиска и фильтров.
     */
    formSubscribe() {
        this.form.valueChanges.pipe(
            debounceTime(300)
        ).subscribe(async res => {
            let employmentsData = res.employments.flat();
            if (employmentsData.length == 0) employmentsData = [1];

            const req: vacancyCatalogInput = {
                filters: {
                    salary: `${res.salary}`,
                    pay: `${res.pay}`,
                    experience: `${res.experience}`,
                    employmentsValues: `${employmentsData.length}`,
                    employments: employmentsData
                },
                lastId: "0", 
                paginationRows: 20, 
                searchText: res.searchText,
            };

            await this.loadCatalogVacanciesAsync(req);
        });
    }

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
     * Функция проставляет начальные фильтры.
     */
    setDefaultFilters() {
        this.form.patchValue({
            salary: 'Date',
            pay: 'UnknownPay',
            experience: 'UnknownExperience',
            employments: [[],[],[]],
        });
    };

   /**
     * Функция загружает список вакансий для каталога.
     * @returns - Список вакансий.
     */
    private async loadCatalogVacanciesAsync(req: vacancyCatalogInput) {
        console.log('Параметры запроса для поиска по вакансиям: ',req);

        (await this._vacancyService.loadCatalogVacanciesAsync(req))
        .subscribe(_ => {
            console.log("Список вакансий: ", this.catalog$.value);
            this.rowsCount = this.catalog$.value.total;
            this.aCatalogVacancies = this.catalog$.value.catalogVacancies;
        });
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
     * Функция фильтрует вакансии по соответствию.
     * @returns - Список вакансий после фильтрации.
     */
    public async onFilterVacanciesAsync() {
        let filterVacancyInput = this.createFilterVacancyResult();
        console.log(filterVacancyInput);

        (await this._vacancyService.filterVacanciesAsync(filterVacancyInput))
        .subscribe(_ => {
            console.log("Список вакансий после фильтрации: ", this.catalog$.value);
            this.rowsCount = this.catalog$.value.total;
            this.aCatalogVacancies = this.catalog$.value.catalogVacancies;
        });
    };

    /**
     * Функция создает входную модель фильтров вакансий.
     * @returns - Входная модель.
     */
    private createFilterVacancyResult(): FilterVacancyInput {
      let model = new FilterVacancyInput();
      model.Salary = this.selectedSalary ? this.selectedSalary.key : "None";

      if (this.selectedEmployment) {
        model.EmploymentsValues = this.selectedEmployment.map((u: any) => u.key).join(',');
      }

      model.Experience = this.selectedExperience ? this.selectedExperience.key : "None";
      model.Pay = this.selectedPay ? this.selectedPay.key : "None";

      return model;
    };

    /**
     * Функция пагинации вакансий.
     * @param page - Номер страницы.
     * @returns - Список вакансий.
     */
     public async onGetVacanciesPaginationAsync(event: any) {
        console.log(event);
        (await this._vacancyService.getVacanciesPaginationAsync(event.page))
            .subscribe(_ => {
                console.log("Пагинация: ", this.pagination$.value), "page: " ;
                this.aCatalogVacancies = this.pagination$.value.vacancies;
                this.setUrlParams(event.page + 1); // Надо инкрементить, так как event.page по дефолту имеет 0 для 1 элемента.
            });
    };

    /**
     * Функция инициализации пагинации.
     */
     private async initVacanciesPaginationAsync() {
        (await this._vacancyService.getVacanciesPaginationAsync(0))
            .subscribe(_ => {
                console.log("Пагинация: ", this.pagination$.value), "page: " + this.page;
                this.setUrlParams(1);
            });
    };
}
