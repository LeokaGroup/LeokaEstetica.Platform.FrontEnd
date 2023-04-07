import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { API_URL } from 'src/app/core/core-urls/api-urls';

@Injectable()
export class FooterService {
    public footerData$ = new BehaviorSubject<any>(null);

    constructor(private readonly http: HttpClient) {

    }

    /**
     * Функция получит список элементов футера.
     * @returns - Список элементов футера.
     */
    public async getFooterItemsAsync() {
        return await this.http.get(API_URL.apiUrl + "/header/items").pipe(
            tap(data => this.footerData$.next(data)
            )
        );
    };
}