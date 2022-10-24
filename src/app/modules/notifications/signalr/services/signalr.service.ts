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
            this.hubConnection = new HubConnectionBuilder().withUrl(API_URL.apiUrl + "/notify").build();                

            this.hubConnection.start()
                .then(async () => {
                    console.log("Соединение установлено");
                    console.log("ConnectionId:", this.hubConnection.connectionId);    
                    
                    (await this._redisService.saveConnectionIdCacheAsync(this.hubConnection.connectionId, localStorage["u_c"]))
                    .subscribe(async (_) => {
                        
                    });
                    
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

    public listenToAllFeeds() {
        (<HubConnection>this.hubConnection).on("Receive", (data: any) => {
            console.log("Данные из хаба: ", data);
            this.$allFeed.next(data);
        });
    };
};