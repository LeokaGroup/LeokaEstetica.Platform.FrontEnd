import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BehaviorSubject, tap} from 'rxjs';
import {API_URL} from 'src/app/core/core-urls/api-urls';
import { Router } from '@angular/router';

/**
 * Класс сервиса проверки доступов к модулям, компонентам платформы.
 */
@Injectable()
export class AccessService {
  apiUrl: any;
  public isShowModalAccess: boolean = false;

  public checkAccess$ = new BehaviorSubject<any>(null);

  constructor(private readonly _http: HttpClient,
              private readonly _router: Router) {

    // Если используем ендпоинты модуля УП.
    if (API_URL.apiUrlProjectManagment != null && API_URL.apiUrlProjectManagment != undefined) {
      this.apiUrl = API_URL.apiUrlProjectManagment;
    }

    // Если используем основные ендпоинты.
    else {
      this.apiUrl = API_URL.apiUrl
    }
  }

  /**
   * Функция проверяет доступ к модулям, компонентам модуля УП.
   * Бесплатные компоненты не проверяются.
   * @param projectId - Id проекта.
   * @param accessModule - Тип модуля.
   * @param accessModuleComponentType - Тип компонента, к которому проверяется доступ.
   * @returns - Признак результата проверки доступа.
   */
  public async checkAccessProjectManagementModuleOrComponentAsync(projectId: number, accessModule: string, accessModuleComponentType: string) {
    return await this._http.get(API_URL.apiUrl + `/access/access-module?projectId=${projectId}&accessModule=${accessModule}&accessModuleComponentType=${accessModuleComponentType}`).pipe(
      tap(data => this.checkAccess$.next(data))
    );
  };
}
