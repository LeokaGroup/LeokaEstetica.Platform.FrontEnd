import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { API_URL } from "src/app/core/core-urls/api-urls";
import { CommitConnectionInput } from "../models/input/connection-input";
import { BehaviorSubject, tap } from 'rxjs';

/**
 * Класс сервиса работы с Redis.
 */
@Injectable()
export class RedisService {
    public profileSignalrConnection$ = new BehaviorSubject<any>([]);

    constructor(private readonly _http: HttpClient) { }

    /**
     * Функция записывает ConnectionId в кэш.
     */
    public async addConnectionIdCacheAsync(connectionId: string) {
        let commitConnectionInput = new CommitConnectionInput();
        commitConnectionInput.ConnectionId = connectionId;

        return await this._http.post(API_URL.apiUrl + "/notifications/commit-connectionid", commitConnectionInput).pipe(
            tap(data => this.profileSignalrConnection$.next(data)
            )
        );
    };
}