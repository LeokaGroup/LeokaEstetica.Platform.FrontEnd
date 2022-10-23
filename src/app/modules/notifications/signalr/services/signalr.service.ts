import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { Observable, Subject } from 'rxjs';
import { API_URL } from 'src/app/core/core-urls/api-urls';
import { Feed } from '../models/feed';

@Injectable()
export class SignalrService {

    private hubConnection: any;
    private $allFeed: Subject<Feed> = new Subject<Feed>();

    constructor() { }

    public startConnection() {
        return new Promise((resolve, reject) => {
            this.hubConnection = new HubConnectionBuilder()
                .withUrl(API_URL.apiUrl + "/notify").build();    

            this.hubConnection
            .start()
                .then(() => {
                    console.log("connection established");
                    console.log("connectionId:", this.hubConnection.connectionId);
                    return resolve(true);
                })
                .catch((err: any) => {
                    console.log("error occured" + err);
                    reject(err);
                });
        });
    };

    public get AllFeedObservable(): Observable<any> {
        return this.$allFeed.asObservable();
    }

    public listenToAllFeeds() {
        (<HubConnection>this.hubConnection).on("Receive", (data: any) => {
            console.log("Данные из хаба: ", data);
            this.$allFeed.next(data);
        });
    };
};