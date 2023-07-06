import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { API_URL } from 'src/app/core/core-urls/api-urls';
import { CloseTicketInput } from '../models/input/close-ticket-input';
import { CreateTicketInput } from '../models/input/create-ticket-input';
import { CreateTicketMessageInput } from '../models/input/create-ticket-message-input';

/**
 * Класс сервиса тикетов.
 */
@Injectable()
export class TicketService {
    public ticketCategories$ = new BehaviorSubject<any>(null);
    public createdTicket$ = new BehaviorSubject<any>(null);
    public profileTickets$ = new BehaviorSubject<any>(null);
    public callcenterTickets$ = new BehaviorSubject<any>(null);
    public selectedTicket$ = new BehaviorSubject<any>(null);
    public ticketMessages$ = new BehaviorSubject<any>(null);
    public closedTicket$ = new BehaviorSubject<any>(null);

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

    /**
    * Функция получает тикеты пользователя.
    * @returns - Список тикетов.
    */
     public async getCallCenterTicketsAsync() {
        return await this._http.get(API_URL.apiUrl + "/tickets/callcenter").pipe(
            tap(data => this.callcenterTickets$.next(data))
        );
    };

    /**
    * Функция получает тикет пользователя по его Id.
    * @param ticketId - Id тикета.
    * @returns - Данные тикета.
    */
     public async getSelectedCallCenterTicketsAsync(ticketId: number) {
        return await this._http.get(API_URL.apiUrl + "/tickets/ticket?ticketId=" + ticketId).pipe(
            tap(data => this.selectedTicket$.next(data))
        );
    };

    /**
    * Функция создает сообщение тикета.
    * @param createTicketMessageInput - Входная модель.
    * @returns - Список сообщений тикета.
    */
     public async createTicketMessageAsync(createTicketMessageInput: CreateTicketMessageInput) {
        return await this._http.post(API_URL.apiUrl + "/tickets/message", createTicketMessageInput).pipe(
            tap(data => this.ticketMessages$.next(data))
        );
    };

    /**
    * Функция закрывает тикет.
    * @param createTicketMessageInput - Входная модель.
    */
     public async closeTicketAsync(closeTicketInput: CloseTicketInput) {
        return await this._http.patch(API_URL.apiUrl + "/tickets/close", closeTicketInput).pipe(
            tap(data => this.closedTicket$.next(data))
        );
    };
}