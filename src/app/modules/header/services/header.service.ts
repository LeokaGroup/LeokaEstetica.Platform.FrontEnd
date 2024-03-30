import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { API_URL } from 'src/app/core/core-urls/api-urls';
import { HeaderMenuItem } from 'src/app/core/models/header-menu-item.model'

@Injectable()
export class HeaderService {
    public headerData$ = new BehaviorSubject<HeaderMenuItem[]>([]);

    constructor(private readonly http: HttpClient) {}

    /**
     * Функция получит список элементов хидера.
     * @returns - Список элементов хидера.
     */
    public getHeaderItemsAsync() {
        return this.http.get<HeaderMenuItem[]>(`${API_URL.apiUrl}/header/items`).pipe(
            tap(data => this.headerData$.next(data))
        );
    }

    // Функция обновит токена пользователя.
    public refreshTokenAsync() {
        const intervalID = setInterval(() => {
            if (!localStorage["t_n"]) {
                clearInterval(intervalID);
                return;
            }

            this.http.get(`${API_URL.apiUrl}/user/token`).subscribe({
                next: (response: any) => {
                    localStorage["t_n"] = response.token;
                    console.log("refresh token", response);
                },
                error: (err) => {
                    console.log("error refresh token", err);
                }
            });
        }, 3600000); // Каждые 60 мин.
    };
}
