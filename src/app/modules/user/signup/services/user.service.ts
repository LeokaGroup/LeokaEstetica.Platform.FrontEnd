import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { API_URL } from 'src/app/core/core-urls/api-urls';
import { SignUpInput } from '../models/signup-input';

@Injectable()
export class UserService {    
    constructor(private readonly http: HttpClient) {

    }

    public headerData$ = new BehaviorSubject<any>(null);
    public userData$ = new BehaviorSubject<any>(null);

    /**
     * Функция регистрирует пользователя.
     * @param email - Email.
     * @param password - Пароль.
     * @returns - Данные пользователя.
     */
    public async signUpAsync(email: string, password: string) {
        let modelInput= new SignUpInput();
        modelInput.email = email;
        modelInput.password = password;

        return await this.http.post(API_URL.apiUrl + "/user/signup", modelInput).pipe(
            tap(data => this.userData$.next(data)
            )
        );
    };
}