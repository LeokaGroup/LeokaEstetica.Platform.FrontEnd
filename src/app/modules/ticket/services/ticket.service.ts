import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { API_URL } from 'src/app/core/core-urls/api-urls';

/**
 * Класс сервиса тикетов.
 */
@Injectable()
export class TicketService {
    public ticketCategories$ = new BehaviorSubject<any>(null);

    constructor(private readonly http: HttpClient) {

    }

    /**
    * Функция получает категории тикетов.
    * @returns - Категории тикетов.
    */
    public async getTicketCategoriesAsync() {
        return await this.http.get(API_URL.apiUrl + "/tickets/categories").pipe(
            tap(data => this.ticketCategories$.next(data))
        );
    };
}