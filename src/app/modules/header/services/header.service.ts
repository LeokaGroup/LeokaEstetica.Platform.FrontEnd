import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { API_URL } from 'src/app/core/core-urls/api-urls';

@Injectable()
export class HeaderService {
    public headerData$ = new BehaviorSubject<any>(null);

    constructor(private readonly http: HttpClient) {

    }

    /**
     * Функция получит список элементов хидера.
     * @returns - Список элементов хидера.
     */
    public async getHeaderItemsAsync() {
        return await this.http.get(API_URL.apiUrl + "/header/items").pipe(
            tap(data => this.headerData$.next(data)
            )
        );
    };
}