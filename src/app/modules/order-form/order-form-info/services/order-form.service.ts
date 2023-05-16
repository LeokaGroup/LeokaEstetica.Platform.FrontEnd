import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { API_URL } from 'src/app/core/core-urls/api-urls';

/**
 * Класс сервиса ФЗ.
 */
@Injectable()
export class OrderFormService {
    public fareRuleInfo$ = new BehaviorSubject<any>(null);

    constructor(private readonly http: HttpClient) {

    }

    /**
    * Функция получает информацию о тарифе.
    * @param publicId - Публичный ключ тарифа.
    * @returns - Информация о тарифе.
    */
    public async getFareRuleInfoAsync(publicId: string) {
        return await this.http.get(API_URL.apiUrl + `/commercial/fare-rule/order-form/${publicId}/info`).pipe(
            tap(data => this.fareRuleInfo$.next(data))
        );
    };
}
