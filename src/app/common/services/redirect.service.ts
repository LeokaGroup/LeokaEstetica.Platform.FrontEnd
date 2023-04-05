import { Injectable } from '@angular/core';

/**
 * Класс сервиса для редиректов приложения.
 * Тут размещаются функции, которые редиректят после каких-либо действий.
 * Когда необходима перезагрузка страницы после редиректа.
 */
@Injectable()
export class RedirectService {
    /**
     * Функция редиректит по указанному роуту.
     * Важно для уведомлений, не удалять!
     * Это сокращает обновление страницы для пользователя.  
     * @param route - Роут, куда надо редиректить.
     */
    public redirect(route: string): void {
        window.location.href = window.location.protocol + '//' + window.location.host + '/' + route;
    };

    /**
     * Функция редиректит по указанному роуту с параметрами в роуте для просмотра проекта.
     * Важно для уведомлений, не удалять!
     * Это сокращает обновление страницы для пользователя.  
     * @param route - Роут, куда надо редиректить.
     * @param param1 - Первый параметр в роуте.
     * @param param2 - Второй параметр в роуте.
     * @param param1Value - Значение для первого параметра в роуте.
     * @param param2Value - Значение для второго параметра в роуте.
     */
    public redirectWithParamsViewProject(route: string, param1Name: string, param2Name: string, param1Value: number, 
        param2Value: string): void {
        window.location.href = window.location.protocol + '//' + window.location.host + '/' + route + "?" + param1Name + "=" + param1Value + "&" + param2Name + "=" + param2Value;
    };
}