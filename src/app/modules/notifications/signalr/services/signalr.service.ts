import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { Observable, Subject } from 'rxjs';
import { API_URL } from 'src/app/core/core-urls/api-urls';
import { RedisService } from 'src/app/modules/redis/services/redis.service';

@Injectable()
export class SignalrService {
    private hubConnection: any;
    private $allFeed: Subject<any> = new Subject<any>();   

    constructor(public readonly _redisService: RedisService) { 
       
    }

    public async startConnection() {               
        return await new Promise(async (resolve, reject) => {
            this.hubConnection = new HubConnectionBuilder().withUrl(API_URL.apiUrl + "/notify", 4).build();                

            this.hubConnection.start()
                .then(async () => {
                    console.log("Соединение установлено");
                    console.log("ConnectionId:", this.hubConnection.connectionId);    
                    
                    return resolve(true);
                })
                .catch((err: any) => {
                    console.log("Ошибка соединения: " + err);
                    reject(err);
                });
        });
    };

    public get AllFeedObservable(): Observable<any> {
        return this.$allFeed.asObservable();
    }

    /**
     * Функция слушает уведомления сохранения профиля пользователя из хаба.
     */
    public listenSuccessSaveProfileInfo() {
        (<HubConnection>this.hubConnection).on("SendNotifySuccessSave", (data: any) => {
            console.log("Хаб успешного сохранения: ", data);
            this.$allFeed.next(data);
        });
    };

    /**
     * Функция слушает уведомления предупреждения о навыках пользователя из хаба.
     */
    public listenWarningUserSkillsInfo() {
        (<HubConnection>this.hubConnection).on("SendNotificationWarningSaveUserSkills", (data: any) => {
            console.log("Хаб навыков: ", data);
            this.$allFeed.next(data);
        });
    };

     /**
     * Функция слушает уведомления предупреждения о целях пользователя из хаба.
     */
      public listenWarningUserIntentsInfo() {
        (<HubConnection>this.hubConnection).on("SendNotificationWarningSaveUserIntents", (data: any) => {
            console.log("Хаб целей: ", data);
            this.$allFeed.next(data);
        });
    };

     /**
     * Функция слушает уведомления создания проекта пользователя из хаба.
     */
      public listenSuccessCreatedUserProjectInfo() {
        (<HubConnection>this.hubConnection).on("SendNotificationSuccessCreatedUserProject", (data: any) => {
            console.log("Хаб создания проекта: ", data);
            this.$allFeed.next(data);
        });
    };
};