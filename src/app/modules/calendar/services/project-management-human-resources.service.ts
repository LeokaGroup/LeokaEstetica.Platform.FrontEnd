import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BehaviorSubject, tap} from 'rxjs';
import {API_URL} from 'src/app/core/core-urls/api-urls';

/**
 * Класс сервиса модуля HR.
 */
@Injectable()
export class ProjectManagementHumanResourcesService {
  apiUrl: any;

  public calendarEvents$ = new BehaviorSubject<any>(null);
  public eventUsers$ = new BehaviorSubject<any>(null);
  public busyVariants$ = new BehaviorSubject<any>(null);

  constructor(private readonly _http: HttpClient) {

    this.apiUrl = API_URL.apiUrlProjectManagementHumanResources;
  }

  /**
   * Функция получает события календаря текущего пользователя.
   * @returns - Список событий.
   */
  public async getCalendarEventsAsync() {
    return await this._http.get(this.apiUrl + "/project-management-human-resources/calendar/events").pipe(
      tap(data => this.calendarEvents$.next(data))
    );
  };

  /**
   * Функция поиска пользователя.
   * @param searchText - Поисковый текст.
   */
  public async searchEventMemberAsync(searchText: string) {
    return await this._http.get(API_URL.apiUrl + `/search/search-user?searchText=${searchText}`).pipe(
      tap(data => this.eventUsers$.next(data))
    );
  };

  /**
   * Функция получает типы занятости.
   */
  public async getBusyVariantsAsync() {
    return await this._http.get(API_URL.apiUrlProjectManagementHumanResources + `/project-management-human-resources/calendar/busy-variants`).pipe(
      tap(data => this.busyVariants$.next(data))
    );
  };
}
