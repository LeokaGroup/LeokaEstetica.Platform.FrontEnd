import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { API_URL } from 'src/app/core/core-urls/api-urls';
import { CreateOrderCacheInput } from '../models/create-order-cache-input';

/**
 * Класс сервиса ФЗ (заказы).
 */
@Injectable()
export class OrderService {
    public orderForm$ = new BehaviorSubject<any>(null);

    constructor(private readonly http: HttpClient) {

    }

    /**
     * Функция создает заказ в кэше
     * @param createOrderCacheInput - Входная модель.
     * @returns - Данные заказа.
     */
    public async createOrderCacheAsync(createOrderCacheInput: CreateOrderCacheInput) {
        return await this.http.post(API_URL.apiUrl + "/commercial/fare-rule/order-form/pre", createOrderCacheInput).pipe(
            tap(data => this.orderForm$.next(data))
        );
    };
}
