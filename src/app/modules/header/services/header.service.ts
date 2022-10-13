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

    // Функция обновит токена пользователя.
    public async refreshTokenAsync() {
        setInterval(async () => {
            if (!localStorage["token"]) {
                clearInterval();
                return;
            }

            try {
                await this.http.get(API_URL.apiUrl.concat("/user/token"))
                    .subscribe({
                        next: (response: any) => {
                            localStorage["token"] = response.token;
                            console.log("refresh token", response);
                        },

                        error: (err) => {
                            console.log("error refresh token", err);
                        }
                    });
            }

            catch (e: any) {
                throw new Error(e);
            }
        }, 3600000); // Каждые 60 мин. 
    }; 
}