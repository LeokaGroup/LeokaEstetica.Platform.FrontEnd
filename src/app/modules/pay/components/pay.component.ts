import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { forkJoin } from "rxjs";
import { PaymentService } from "../services/pay.service";

@Component({
    selector: "pay",
    templateUrl: "./pay.component.html",
    styleUrls: ["./pay.component.scss"]
})

/**
 * Класс компонента страницы оплаты.
 */
export class PayComponent implements OnInit {
    // public readonly fonData$ = this._landingService.fonData$;

    formSignUp: FormGroup = new FormGroup({

        "email": new FormControl("", [
            Validators.required,
            Validators.email
        ]),

        "password": new FormControl("", [
            Validators.required,
            Validators.pattern(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&^_-]).{8,}/)
        ])
    });

    isEmail: boolean = false;

    constructor(private readonly _paymentService: PaymentService) {
    }

    public async ngOnInit() {
        forkJoin([
            
        ]).subscribe();        
    };

    /**
     * Функция получает данные фона главного лендинга.
     * @returns - Данные фона.
     */
    // private async getFonLandingStartAsync() {
    //     (await this._landingService.getFonLandingStartAsync())
    //     .subscribe(_ => {
    //         console.log("Данные фона лендинга: ", this.fonData$.value);
    //     });
    // };

    /**
     * Функция управляет видимость поля Email.
     */
    // public onChangeVisibleEmail() {
        
    // };
}