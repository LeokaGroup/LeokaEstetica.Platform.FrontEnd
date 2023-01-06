import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { FilterVacancyInput } from "../../models/input/filter-vacancy-input";
import { VacancyService } from "../../services/vacancy.service";

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
        private readonly _vacancyService: VacancyService) { }

    formSignUp: FormGroup = new FormGroup({

        "email": new FormControl("", [
            Validators.required,
            Validators.email
        ])
    });

    public readonly catalog$ = this._vacancyService.catalog$;

    vacancyId: number = 0;
    aSalaries: any[] = [
        // { name: 'По соответствию', key: 'Match' },
        { name: 'По дате', key: 'Date' },
        { name: 'По убыванию зарплат', key: 'DescSalary' },
        { name: 'По возрастанию зарплат', key: 'AscSalary' }
    ];
    selectedSalary: any;
    aPays: any[] = [
        { name: 'Не имеет значения', key: 'Unknown' },
        { name: 'Есть оплата', key: 'Pay' },
        { name: 'Без оплаты', key: 'NotPay' }        
    ];
    selectedPay: any;
    aExperience: any[] = [
        { name: 'Не имеет значения', key: 'Unknown' },
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
    selectedEmployment: any;
    aKeywords: any[] = [
        { name: 'В названии вакансии', key: 'VacancyName' },
        { name: 'В описании вакансии', key: 'VacancyDetail' }
    ];
    selectedKeyword: any;

    public async ngOnInit() {
        await this.loadCatalogVacanciesAsync();      
        this.setDefaultFilters();
    };

    /**
     * Функция проставляет начальные фильтры.
     */
    private setDefaultFilters() {
        this.selectedSalary = this.aSalaries[0];  
    };

   /**
     * Функция загружает список вакансий для каталога.
     * @returns - Список вакансий.
     */
    private async loadCatalogVacanciesAsync() {    
        (await this._vacancyService.loadCatalogVacanciesAsync())
        .subscribe(_ => {
            console.log("Список вакансий: ", this.catalog$.value);
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
    public async onFilterSalaryAsync() {
        console.log(this.selectedSalary);
        let filterVacancyInput = this.createFilterVacancyResult();
        filterVacancyInput.Salary = this.selectedSalary.key;

        (await this._vacancyService.filterSalaryAsync(filterVacancyInput))
        .subscribe(_ => {
            console.log("Список вакансий после фильтрации: ", this.catalog$.value);
        });
    };

    /**
     * Функция создает входную модель фильтров вакансий по соответствиям.
     * @returns - Входная модель.
     */
    private createFilterVacancyResult(): FilterVacancyInput {
        let model = new FilterVacancyInput();

        return model;
    };
}