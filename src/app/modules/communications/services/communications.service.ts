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
  public communicationsAbstractGroups$ = new BehaviorSubject<any>(null);
  public groupObjects$ = new BehaviorSubject<any>(null);
  public groupObjectDialogs$ = new BehaviorSubject<any>(null);
  public receiptGroupObjectDialogs$ = new BehaviorSubject<any>(null);

  constructor(private readonly _http: HttpClient) {
  }

  /**
   * Функция отправляет список абстрактных областей подписчикам.
   * @param abstractScopes - Список абстрактных областей.
   */
  public sendAbstractScopes(abstractScopes: any[]) {
    this.abstractScopes$.next(abstractScopes);
  };

  /**
   * Функция отправляет в прокси-сервис выбранную абстрактную область чата.
   * @param abstractScopeId - Id выбранной абстрактной области.
   * @param abstractScopeType - Тип выбранной абстрактной области.
   */
  public sendAbstractScopeGroupObjects(abstractScopeId: number, abstractScopeType: number) {
    this.communicationsAbstractGroups$.next({abstractScopeId, abstractScopeType, account: localStorage["u_e"]});
  }

  /**
   * Функция отправляет группы объектов выбранной абстрактной области чата.
   * @param groupsObjects - Список групп объектов.
   */
  public sendGroupObjects(groupsObjects: any) {
    this.groupObjects$.next(groupsObjects);
  }

  /**
   * Функция отправляет в прокси-сервис выбранный объект группы
   * @param abstractScopeId - Id выбранной абстрактной области.
   */
  public sendGroupObject(abstractScopeId: number) {
    this.groupObjectDialogs$.next({abstractScopeId, account: localStorage["u_e"]});
  }

  /**
   * Функция отправляет в прокси-сервис результаты диалогов группы.
   * @param abstractGroupId - Id выбранного объекта группы, для которого получить диалоги.
   */
  public getGroupObjectDialogs(objectDialogs: any[]) {
    this.receiptGroupObjectDialogs$.next(objectDialogs);
  }
}
