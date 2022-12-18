import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { API_URL } from 'src/app/core/core-urls/api-urls';
import { ProjectResponseInput } from 'src/app/modules/project/detail/models/input/project-response-input';
import { DialogInput } from '../models/input/dialog-input';

/**
 * Общий сервис сообщений чатов.
 */
@Injectable()
export class ChatMessagesService {
    constructor(private readonly _http: HttpClient) {

    }

    public messages$ = new BehaviorSubject<any>(null);  
    public dialog$ = new BehaviorSubject<any>(null);  

    public async getProjectDialogsAsync() {
        return await this._http.get(API_URL.apiUrl + "/chat/dialogs").pipe(
            tap(data => this.messages$.next(data))
        );
    };

    public async getProjectDialogAsync(discussionTypeId: number) {
        return await this._http.get(API_URL.apiUrl + "/chat/dialog?discussionType=Project&discussionTypeId=" 
        + discussionTypeId).pipe(
            tap(data => this.dialog$.next(data))
        );
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
};