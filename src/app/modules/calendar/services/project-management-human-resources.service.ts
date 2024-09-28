import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BehaviorSubject, tap} from 'rxjs';
import {API_URL} from 'src/app/core/core-urls/api-urls';
import {CalendarInput} from "../models/input/calendar-input";

/**
 * Класс сервиса модуля HR.
 */
@Injectable()
export class ProjectManagementHumanResourcesService {
  apiUrl: any;

  public calendarEvents$ = new BehaviorSubject<any>(null);
  public eventUsers$ = new BehaviorSubject<any>(null);
  public busyVariants$ = new BehaviorSubject<any>(null);
  public eventDetails$ = new BehaviorSubject<any>(null);

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

  /**
   * Функция создает событие календаря.
   * @param eventInput - Входная модель.
   */
  public async createEventAsync(calendarInput: CalendarInput) {
    return await this._http.post(API_URL.apiUrlProjectManagementHumanResources + `/project-management-human-resources/calendar/event`, calendarInput).pipe(
      tap(_ => console.log("Событие успешно создано"))
    );
  };

  /**
   * Функция получает детали события календаря.
   * @param eventId - Id события.
   */
  public async getEventDetailsAsync(eventId: number) {
    return await this._http.get(API_URL.apiUrlProjectManagementHumanResources + `/project-management-human-resources/calendar/event?eventId=${eventId}`).pipe(
      tap(data => this.eventDetails$.next(data))
    );
  };

  /**
   * Функция обновляет событие календаря.
   * @param eventInput - Входная модель.
   */
  public async updateEventAsync(calendarInput: CalendarInput) {
    return await this._http.put(API_URL.apiUrlProjectManagementHumanResources + `/project-management-human-resources/calendar/event`, calendarInput).pipe(
      tap(_ => console.log("Событие успешно обновлено"))
    );
  };
}
