import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { API_URL } from 'src/app/core/core-urls/api-urls';
import { ConfirmInput } from '../signup/models/input/confirm-input';
import { SignUpInput } from '../signup/models/input/signup-input';

/**
 * Класс сервиса работы с пользователями.
 */
@Injectable()
export class UserService {    
    constructor(private readonly _http: HttpClient) {

    }

    public headerData$ = new BehaviorSubject<any>(null);
    public userData$ = new BehaviorSubject<any>(null);
    public confirmAccount$ = new BehaviorSubject<any>(null);

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

        return await this._http.post(API_URL.apiUrl + "/user/signup", modelInput).pipe(
            tap(data => this.userData$.next(data)
            )
        );
    };

    /**
     * Функция авторизует пользователя.
     * @param email - Email.
     * @param password - Пароль.
     * @returns - Данные пользователя.
     */
     public async signInAsync(email: string, password: string) {
        let modelInput= new SignUpInput();
        modelInput.email = email;
        modelInput.password = password;

        return await this._http.post(API_URL.apiUrl + "/user/signin", modelInput).pipe(
            tap(data => this.userData$.next(data)
            )
        );
    };

    /**
     * Функция подтверждает аккаунт по коду.   
     * @param confirmEmailCode - Код подтверждения.
     * @returns - Статус подтверждения.
     */
    public async confirmEmailCodeAsync(confirmAccountCode: string) {
        let modelInput= new ConfirmInput();
        modelInput.ConfirmAccountCode = confirmAccountCode;

        return await this._http.patch(API_URL.apiUrl + "/user/account/confirm?code=", modelInput).pipe(
            tap(data => this.confirmAccount$.next(data)
            )
        );
    };
}