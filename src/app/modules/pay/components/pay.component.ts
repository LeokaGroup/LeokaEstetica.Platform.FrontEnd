import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { forkJoin } from "rxjs";
import { CreateOrderInput } from "../models/create-order-input";
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
    // public readonly createOrder$ = this._paymentService.createOrder$;

    // formPay: FormGroup = new FormGroup({
    //     "pan": new FormControl("", [
    //         Validators.required
    //     ]),

    //     "email": new FormControl("", [
    //         Validators.required,
    //         Validators.email
    //     ]),

    //     "expiry": new FormControl("", [
    //         Validators.required
    //     ]),

    //     "cvc": new FormControl("", [
    //         Validators.required
    //     ])
    // });

    isEmail: boolean = false;

    constructor(private readonly _paymentService: PaymentService) {
    }

    public async ngOnInit() {
        forkJoin([
            
        ]).subscribe();        
    };

    /**
     * Функция видимости поля почты.
     */
    // public onChangevisibleEmailField() {
    //     this.isEmail = !this.isEmail;
    // };    
}