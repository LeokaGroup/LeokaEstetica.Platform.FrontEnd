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
    selectedEmployment: any;

    // TODO: этот тип фильтра будем использовать при поиске. Вне поиска решили не делать.
    // aKeywords: any[] = [
    //     { name: 'В названии вакансии', key: 'VacancyName' },
    //     { name: 'В описании вакансии', key: 'VacancyDetail' }
    // ];
    // selectedKeyword: any;

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
    public async onFilterVacanciesAsync() {
        let filterVacancyInput = this.createFilterVacancyResult();
        console.log(filterVacancyInput);

        (await this._vacancyService.filterVacanciesAsync(filterVacancyInput))
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
        model.Salary = this.selectedSalary ? this.selectedSalary.key : "None";

        // Если выбран 1 чекбокс, то добавляем первое значение.
        if (this.selectedEmployment.length == 1) {
            model.Employments.push(this.selectedEmployment[0].key);
        }

        // Иначе добавляем все значения чекбоксов, которые выделены.
        else if (this.selectedEmployment.length > 1) {
            let splitEmployments = this.selectedEmployment.map((u : any) => u.key).join(',').split(",");
            splitEmployments.forEach((item: any) => {
                model.Employments.push(item);
            });
        }

        model.Experience = this.selectedExperience ? this.selectedExperience.key : "None";
        model.Pay = this.selectedPay ? this.selectedPay.key : "None";

        return model;
    };
}