import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { Observable, Subject } from 'rxjs';
import { API_URL } from 'src/app/core/core-urls/api-urls';

@Injectable()
export class SignalrService {
    private hubConnection: any;
    private $allFeed: Subject<any> = new Subject<any>();   

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
            this.$allFeed.next(data);
        });
    };

    /**
     * Функция слушает уведомления предупреждения о навыках пользователя из хаба.
     */
    public listenWarningUserSkillsInfo() {
        (<HubConnection>this.hubConnection).on("SendNotificationWarningSaveUserSkills", (data: any) => {
            this.$allFeed.next(data);
        });
    };

     /**
     * Функция слушает уведомления предупреждения о целях пользователя из хаба.
     */
      public listenWarningUserIntentsInfo() {
        (<HubConnection>this.hubConnection).on("SendNotificationWarningSaveUserIntents", (data: any) => {
            this.$allFeed.next(data);
        });
    };

     /**
     * Функция слушает уведомления создания проекта пользователя из хаба.
     */
      public listenSuccessCreatedUserProjectInfo() {
        (<HubConnection>this.hubConnection).on("SendNotificationSuccessCreatedUserProject", (data: any) => {
            this.$allFeed.next(data);
        });
    };

    /**
     * Функция слушает уведомления создания проекта пользователя из хаба.
     */
     public listenWarningDublicateUserProjectInfo() {
        (<HubConnection>this.hubConnection).on("SendNotificationWarningDublicateUserProject", (data: any) => {
            this.$allFeed.next(data);
        });
    };

    /**
     * Функция слушает уведомления создания вакансии пользователя из хаба.
     */
     public listenSuccessCreatedUserVacancyInfo() {
        (<HubConnection>this.hubConnection).on("SendNotificationSuccessCreatedUserVacancy", (data: any) => {
            this.$allFeed.next(data);
        });
    };

    /**
     * Функция слушает уведомления обновления проекта пользователя из хаба.
     */
     public listenSuccessUpdatedUserVacancyInfo() {
        (<HubConnection>this.hubConnection).on("SendNotificationSuccessUpdatedUserProject", (data: any) => {
            this.$allFeed.next(data);
        });
    };

    /**
     * Функция слушает уведомления прикрепления вакансии проекта из хаба.
     */
     public listenSuccessAttachProjectVacancyInfo() {
        (<HubConnection>this.hubConnection).on("SendNotificationSuccessAttachProjectVacancy", (data: any) => {
            this.$allFeed.next(data);
        });
    };

    /**
     * Функция слушает уведомления дубликата прикрепления вакансии проекта из хаба.
     */
     public listenErrorDublicateAttachProjectVacancyInfo() {
        (<HubConnection>this.hubConnection).on("SendNotificationErrorDublicateAttachProjectVacancy", (data: any) => {
            this.$allFeed.next(data);
        });
    };

    /**
     * Функция слушает уведомления об отклике на проект из хаба.
     */
     public listenSuccessProjectResponseInfo() {
        (<HubConnection>this.hubConnection).on("SendNotificationSuccessProjectResponse", (data: any) => {
            this.$allFeed.next(data);
        });
    };

    /**
     * Функция слушает уведомления о предупреждении отклика на проект из хаба.
     */
     public listenWarningProjectResponseInfo() {
        (<HubConnection>this.hubConnection).on("SendNotificationWarningProjectResponse", (data: any) => {
            this.$allFeed.next(data);
        });
    };
};