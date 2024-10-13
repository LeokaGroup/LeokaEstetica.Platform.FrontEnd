import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

/**
 * Класс сервиса модуля коммуникаций.
 * Используется как прокси-сервис для передачи данных между компонентами.
 */
@Injectable()
export class CommunicationsServiceService {
  public abstractScopes$ = new BehaviorSubject<any>(null);

  constructor(private readonly _http: HttpClient) {
  }

  /**
   * Функция отправляет список абстрактных областей подписчикам.
   * @param abstractScopes - Список абстрактных областей.
   */
  public sendAbstractScopes(abstractScopes: any[]) {
    this.abstractScopes$.next(abstractScopes);
  };
}
