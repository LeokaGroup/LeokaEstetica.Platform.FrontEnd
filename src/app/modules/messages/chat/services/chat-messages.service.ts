import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { API_URL } from 'src/app/core/core-urls/api-urls';
import { DialogInput } from '../models/input/dialog-input';
import { DialogMessageInput } from '../models/input/dialog-message-input';

/**
 * Общий сервис сообщений чатов.
 */
@Injectable()
export class ChatMessagesService {
    constructor(private readonly _http: HttpClient) {

    }

    public messages$ = new BehaviorSubject<any>(null);  
    public dialog$ = new BehaviorSubject<any>(null);  
    public profileMessages$ = new BehaviorSubject<any>(null);  

    /**
     * Функция получает список диалогов.
     * @returns - Список диалогов.
     */
    public async getProjectDialogsAsync() {
        return await this._http.get(API_URL.apiUrl + `/chat/dialogs`).pipe(
            tap(data => this.messages$.next(data))
        );
    };

    /**
     * Функция получает список диалогов для ЛК.
     * @returns - Список диалогов.
     */
     public async getProfileDialogsAsync() {
        return await this._http.get(API_URL.apiUrl + `/chat/profile-messages`).pipe(
            tap(data => this.profileMessages$.next(data))
        );
    };

    /**
     * Функция получает диалог и его сообщения.
     * @param discussionTypeId - Id типа обсуждения.
     * @param dialogId - Id диалога.
     * @returns - Диалог и его сообщения.
     */
    public async getProjectDialogAsync(discussionTypeId: number, dialogId: number) {
        return new Promise(async resolve => {
            await this._http.get(API_URL.apiUrl + `/chat/dialog?dialogId=${dialogId}&discussionType=Project&discussionTypeId=${discussionTypeId}`)
                .subscribe({
                    next: (response: any) => {
                        resolve(response);
                    },
    
                    error: (err) => {
                        throw new Error(err);
                    }
                });
        })  
    };   

    /**
     * Функция создает диалог с владельцем проекта, если он еще не создан.
     * Если диалог уже есть с текущим юзером и владельцем проекта, 
     * то ничего не происходит и диалог считается открытым для общения.
     * @param writeOwnerDialog - Входная модель.
     * @returns - Данные диалога.
     */
     public async writeOwnerDialogAsync(writeOwnerDialogInput: DialogInput) {
        return await this._http.post(API_URL.apiUrl + "/chat/write", writeOwnerDialogInput).pipe(
            tap(data => this.dialog$.next(data))
        );
    };

     /**
     * Функция отправляет сообщение.
     * Если диалог уже есть с текущим юзером и владельцем проекта, 
     * то ничего не происходит и диалог считается открытым для общения.
     * @param dialogMessageInput - Входная модель.
     * @returns - Данные диалога.
     */
      public async sendDialogMessageAsync(dialogMessageInput: DialogMessageInput) {
        return await this._http.post(API_URL.apiUrl + "/chat/message", dialogMessageInput).pipe(
            tap(data => this.messages$.next(data))
        );
    };
};