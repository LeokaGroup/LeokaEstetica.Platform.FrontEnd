import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable, OnInit } from "@angular/core";
import { API_URL } from "src/app/core/core-urls/api-urls";
import { ConnectionInput } from "../models/input/connection-input";
import { BehaviorSubject, tap } from 'rxjs';

/**
 * Класс сервиса работы с Redis.
 */
@Injectable()
export class RedisService implements OnInit {
    public profileSignalrConnection$ = new BehaviorSubject<any>([]);

    constructor(private readonly _http: HttpClient) {}

    public async ngOnInit() {

    };

    /**
     * Функция записывает ConnectionId в кэш.
     */
    public async saveConnectionIdCacheAsync(connectionId: string, userCode: string) {
        let model = new ConnectionInput();
        model.ConnectionId = connectionId;
        model.UserCode = userCode;
        console.log("connectionId",connectionId, "userCode",userCode);

        const REQ_HEADERS = new HttpHeaders({ 
            'Authorization': 'Bearer ' + localStorage["t_n"]
         });
        
        return await this._http.post(API_URL.apiUrl + "/notifications/signalr-connectionid", model, { headers: REQ_HEADERS }).pipe(
            tap(data => this.profileSignalrConnection$.next(data)            
            )
        );
    }; 
}