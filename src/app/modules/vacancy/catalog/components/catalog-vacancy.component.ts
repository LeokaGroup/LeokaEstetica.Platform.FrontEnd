import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { UserService } from "../../../user/services/user.service";
import { VacancyService } from "../../services/vacancy.service";

@Component({
    selector: "catalog",
    templateUrl: "./catalog-vacancy.component.html",
    styleUrls: ["./catalog-vacancy.component.scss"]
})

/**
 * Класс компонента каталога вакансий.
 */
export class CatalogVacancyComponent implements OnInit {
    constructor(private readonly _userService: UserService,
        private readonly _router: Router,
        private readonly _vacancyService: VacancyService) { }

    formSignUp: FormGroup = new FormGroup({

        "email": new FormControl("", [
            Validators.required,
            Validators.email
        ])
    });

    public readonly catalog$ = this._vacancyService.catalog$;

    public async ngOnInit() {
        await this.loadCatalogVacanciesAsync();
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
}