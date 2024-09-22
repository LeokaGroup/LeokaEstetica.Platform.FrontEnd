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
}
