import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { UserService } from "../../user/services/user.service";
import { CreateVacancyInput } from "../models/input/create-vacancy-input";
import { VacancyService } from "../services/vacancy.service";

@Component({
    selector: "create",
    templateUrl: "./create.component.html",
    styleUrls: ["./create.component.scss"]
})

/**
 * Класс компонента создания вакансии.
 */
export class CreateVacancyComponent implements OnInit {
    constructor(private readonly _userService: UserService,
        private readonly _router: Router,
        private readonly _vacancyService: VacancyService) { }
    public readonly vacancy$ = this._vacancyService.vacancy$;

    vacancyName: string = "";
    vacancyText: string = "";
    workExperience: string = "";
    employment: string = "";
    payment: string = "";

    public async ngOnInit() {
        
    };

   /**
     * Функция регистрирует пользователя.     
     * @returns - Данные пользователя.
     */
    public async onCreateVacancyAsync() {  
        let model = this.CreateVacancyModel();  

        (await this._vacancyService.createVacancyAsync(model))
        .subscribe(_ => {
            console.log("Новая вакансия: ", this.vacancy$.value);            
        });
    };

    /**
     * Функция создает модель для создания вакансии.
     * @returns - Входная модель вакансии.
     */
    private CreateVacancyModel(): CreateVacancyInput {
        let model = new CreateVacancyInput();
        model.VacancyName = this.vacancyName;
        model.VacancyText = this.vacancyText;
        model.Employment = this.employment;
        model.Payment = this.payment;
        model.WorkExperience = this.workExperience;

        return model;
    };
}