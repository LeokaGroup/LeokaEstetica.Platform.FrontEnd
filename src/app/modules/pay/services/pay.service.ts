import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { API_URL } from 'src/app/core/core-urls/api-urls';
import { CreateOrderInput } from '../models/create-order-input';

/**
 * Класс платежного сервиса.
 */
@Injectable()
export class PaymentService {
    public createOrder$ = new BehaviorSubject<any>(null);

    constructor(private readonly http: HttpClient) {

    }

    /**
     * Функция создает палтеж.
     * @param createOrderInput - Входная модель.
     * @returns - Данные платежа.
     */
    public async createOrderAsync(createOrderInput: CreateOrderInput) {
        return await this.http.post(API_URL.apiUrl + "/commercial/payments", createOrderInput).pipe(
            tap(data => this.createOrder$.next(data))
        );
    };
}