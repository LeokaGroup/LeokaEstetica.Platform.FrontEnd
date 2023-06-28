import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { API_URL } from 'src/app/core/core-urls/api-urls';
import { CreateTicketInput } from '../models/input/create-ticket-input';

/**
 * Класс сервиса тикетов.
 */
@Injectable()
export class TicketService {
    public ticketCategories$ = new BehaviorSubject<any>(null);
    public createdTicket$ = new BehaviorSubject<any>(null);
    public profileTickets$ = new BehaviorSubject<any>(null);

    constructor(private readonly _http: HttpClient) {

    }

    /**
    * Функция получает категории тикетов.
    * @returns - Категории тикетов.
    */
    public async getTicketCategoriesAsync() {
        return await this._http.get(API_URL.apiUrl + "/tickets/categories").pipe(
            tap(data => this.ticketCategories$.next(data))
        );
    };

    /**
    * Функция создает тикет.
    * @param createTicketInput - Входная модель.
    */
     public async createTicketAsync(createTicketInput: CreateTicketInput) {
        return await this._http.post(API_URL.apiUrl + "/tickets/ticket", createTicketInput).pipe(
            tap(data => this.createdTicket$.next(data))
        );
    };

    /**
    * Функция получает тикеты пользователя.
    * @returns - Список тикетов.
    */
     public async getProfileTicketsAsync() {
        return await this._http.get(API_URL.apiUrl + "/tickets/profile").pipe(
            tap(data => this.profileTickets$.next(data))
        );
    };
}