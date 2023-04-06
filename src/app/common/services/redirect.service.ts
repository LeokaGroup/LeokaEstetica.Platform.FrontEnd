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
}