import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { API_URL } from 'src/app/core/core-urls/api-urls';
import { CreateOrderCacheInput } from '../models/create-order-cache-input';
import { PaymentOrderInput } from '../models/payment-order-input';

/**
 * Класс сервиса ФЗ (заказы).
 */
@Injectable()
export class OrderService {
    public orderForm$ = new BehaviorSubject<any>(null);
    public orderProducts$ = new BehaviorSubject<any>(null);
    public orderPay$ = new BehaviorSubject<any>(null);
    public freePrice$ = new BehaviorSubject<any>(null);
    public calculatedPrice$ = new BehaviorSubject<any>(null);

    constructor(private readonly http: HttpClient) {

    }

    /**
     * Функция создает заказ.
     * @param createOrderCacheInput - Входная модель.
     * @returns - Данные заказа.
    */
    public async createOrderAsync(createOrderCacheInput: CreateOrderCacheInput) {
        return await this.http.post(API_URL.apiUrl + "/commercial/order/order-form/pre", createOrderCacheInput).pipe(
            tap(data => this.orderForm$.next(data))
        );
    };

    /**
     * TODO: Если вернем услуги и сервисы, то эта функция понадобиться. Пока оставим.
     * Функция получает заказ из кэша.
     * @param publicId - Публичный код тарифа.
     * @returns - Данные заказа.
    */
    public async getOrderProductsCacheAsync(publicId: string) {
        return await this.http.get(API_URL.apiUrl + "/commercial/fare-rule/order-form/products?publicId=" + publicId).pipe(
            tap(data => this.orderProducts$.next(data))
        );
    };

    /**
     * Функция оплачивает заказ.
     * @param paymentOrderInput - Входная модель.
     * @returns - Данные заказа.
    */
     public async payOrderAsync(paymentOrderInput: PaymentOrderInput) {
        return await this.http.post(API_URL.apiUrl + "/commercial/payments", paymentOrderInput).pipe(
            tap(data => this.orderPay$.next(data))
        );
    };

  /**
   * Функция вычисляет цену тарифа исходя из параметров.
   * @param publicId - Публичный ключ тарифа.
   * @param selectedMonth - Кол-во месяцев подписки.
   * @param employeeCount - Кол-во сотрудников в организации.
   * @returns - Данные вычисленной цены тарифа.
   */
  public async calculateFareRulePriceAsync(publicId: string, selectedMonth: number, employeeCount: number) {
    return await this.http.get(API_URL.apiUrl +
      `/commercial/calculate-price?publicId=${publicId}&selectedMonth=${selectedMonth}&employeeCount=${employeeCount}`).pipe(
      tap(data => this.calculatedPrice$.next(data))
    );
  };

  /**
   * Функция вычисляет цену за публикацию вакансии в соответствии с тарифом пользователя.
   */
  public async calculatePricePostVacancyAsync() {
    return await this.http.get(API_URL.apiUrl + "/commercial/calculate-price-vacancy").pipe(
      tap(data => this.calculatedPrice$.next(data))
    );
  };
}
