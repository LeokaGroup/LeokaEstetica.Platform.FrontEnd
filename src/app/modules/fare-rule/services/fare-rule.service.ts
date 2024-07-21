import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { API_URL } from 'src/app/core/core-urls/api-urls';

/**
 * Класс сервиса правил тарифов.
 */
@Injectable()
export class FareRuleService {
    public fonData$ = new BehaviorSubject<any>(null);
    public fareRules$ = new BehaviorSubject<any>([]);

    constructor(private readonly http: HttpClient) {

    }

    /**
     * Функция получает список тарифов.
     * @returns - Список тарифов.
     */
    public async getFareRulesAsync() {
        return await this.http.get(API_URL.apiUrl + "/rules/get-rules").pipe(
            tap(data => this.fareRules$.next(data))
        );
    };
}
