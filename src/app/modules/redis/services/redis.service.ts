import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { API_URL } from "src/app/core/core-urls/api-urls";
import { BehaviorSubject, tap } from 'rxjs';

/**
 * Класс сервиса работы с Redis.
 */
@Injectable()
export class RedisService {
    public checkUserCode$ = new BehaviorSubject<any>(null);

    constructor(private readonly _http: HttpClient) { }

  /**
   * Функция проверяет, есть ли в Redis такой код пользователя.
   * @param userCode - Код пользователя.
   * @param module - Модуль приложения.
   */
  public async checkConnectionIdCacheAsync(userCode: string, module: string) {
    return await this._http.get(API_URL.apiUrl + `/notifications/check-connectionid?userCode=${userCode}&module=${module}`).pipe(
      tap(data => this.checkUserCode$.next(data))
    );
    };
}
