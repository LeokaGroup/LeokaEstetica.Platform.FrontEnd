import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { API_URL } from 'src/app/core/core-urls/api-urls';
import { CreateRefundInput } from '../../vacancy/models/input/create-refund-input';

/**
 * Класс сервиса подписок.
 */
@Injectable()
export class SubscriptionsService {
    public subscriptions$ = new BehaviorSubject<any>(null);
    public refund$ = new BehaviorSubject<any>(null);
    public fareRuleInfo$ = new BehaviorSubject<any>(null);
    public createdRefund$ = new BehaviorSubject<any>(null);

    constructor(private readonly _http: HttpClient) {

    }

    /**
     * Функция получает список подписок.
     * @returns - Список подписок.
     */
    public async getSubscriptionsAsync() {
        return await this._http.get(API_URL.apiUrl + "/subscriptions/all-subscriptions").pipe(
            tap(data => this.subscriptions$.next(data))
        );
    };

    /**
     * Функция вычисляет сумму возврата.
     * @returns - Данные возврата.
     */
    public async calculateRefundAsync() {
        return await this._http.get(API_URL.apiUrl + "/refunds/calculate").pipe(
            tap(data => this.refund$.next(data))
        );
    };

    /**
     * Функция получает детали тарифа.
     * @param objectId - Id тарифа.
     */
     public async getFareRuleDetailsAsync(objectId: number) {
        return await this._http.get(API_URL.apiUrl + "/rules/details?objectId=" + objectId).pipe(
            tap(data => this.fareRuleInfo$.next(data))
        );
    };

     /**
      * TODO: Вынести эту функцию в отдельный сервис возвратов. го тоже надо завести.
     * Функция создает возврат.
     * @returns - Данные возврата.
     */
     public async createRefundAsync(refundInput: CreateRefundInput) {
        return await this._http.post(API_URL.apiUrl + "/refunds/refunds", refundInput).pipe(
            tap(data => this.createdRefund$.next(data))
        );
    };
}