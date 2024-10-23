import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BehaviorSubject, tap} from 'rxjs';
import {API_URL} from "../../../core/core-urls/api-urls";

/**
 * Класс сервиса модуля коммуникаций.
 * Используется как прокси-сервис для передачи данных между компонентами и как API-сервис.
 */
@Injectable()
export class CommunicationsServiceService {
  public abstractScopes$ = new BehaviorSubject<any>(null);
  public communicationsAbstractGroups$ = new BehaviorSubject<any>(null);
  public groupObjects$ = new BehaviorSubject<any>(null);
  public groupObjectDialogs$ = new BehaviorSubject<any>(null);
  public receiptGroupObjectDialogs$ = new BehaviorSubject<any>(null);
  public dialogMessages$ = new BehaviorSubject<any>(null);
  public receiveDialogMessages$ = new BehaviorSubject<any>(null);
  public createdDialog$ = new BehaviorSubject<any>(null);
  public sendMessage$ = new BehaviorSubject<any>(null);
  public receiveMessage$ = new BehaviorSubject<any>(null);
  public aGroupObjectActions$ = new BehaviorSubject<any>(null);
  public aDialogGroups$ = new BehaviorSubject<any>(null);

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
  };

  /**
   * Функция отправляет группы объектов выбранной абстрактной области чата.
   * @param groupsObjects - Список групп объектов.
   */
  public sendGroupObjects(groupsObjects: any) {
    this.groupObjects$.next(groupsObjects);
  };

  /**
   * Функция отправляет в прокси-сервис выбранный объект группы
   * @param abstractScopeId - Id выбранной абстрактной области.
   */
  public sendGroupObject(abstractScopeId: number) {
    this.groupObjectDialogs$.next({abstractScopeId, account: localStorage["u_e"]});
  };

  /**
   * Функция отправляет в прокси-сервис выбранный объект группы
   * @param dialogId - Id диалога.
   */
  public sendDialogMessages(dialogId: number) {
    this.dialogMessages$.next({dialogId, account: localStorage["u_e"]});
  };

  /**
   * Функция отправляет в прокси-сервис сообщения выбранного диалога.
   * @param dialogMessages - Сообщения диалога.
   */
  public receiveDialogMessages(dialogMessages: any[]) {
    this.receiveDialogMessages$.next({dialogMessages});
  };

  /**
   * Функция создает диалог и добавляет в него участников.
   @param memberMails - Почты участников.
   @param dialogName - Название диалога.
   */
  public async onCreateDialogAsync(memberMails: string[], dialogName: string) {
    return await this._http.post(API_URL.apiUrlCommunications + "/communications/dialogs/dialog", {
      memberEmails: memberMails,
      dialogName: dialogName
    }).pipe(
      tap((data: any) => this.createdDialog$.next(data))
    );
  };

  /**
   * Функция отправляет в прокси-сервис сообщение диалога.
   * @param dialogMessages - Сообщение диалога.
   */
  public sendMessage(message: any) {
    this.sendMessage$.next(message);
  };

  /**
   * Функция получает из прокси-сервиса сообщение диалога.
   * @param dialogMessages - Сообщение диалога.
   */
  public receiveMessage(message: any) {
    this.receiveMessage$.next(message);
  };

  /**
   * Функция получает элементы меню для групп объектов чата.
   */
  public async getGroupObjectMenuItemsAsync() {
    return await this._http.get(API_URL.apiUrlCommunications + "/communications/menu/group-objects-menu").pipe(
      tap((data: any) => this.aGroupObjectActions$.next(data))
    );
  };

  /**
   * Функция получает элементы меню группировок диалогов чата.
   */
  public async getDialogGroupMenuItemsAsync() {
    return await this._http.get(API_URL.apiUrlCommunications + "/communications/menu/dialog-group-menu").pipe(
      tap((data: any) => this.aDialogGroups$.next(data))
    );
  };
}
