import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { API_URL } from 'src/app/core/core-urls/api-urls';

/**
 * Класс сервиса поиска в проектах.
 */
@Injectable()
export class SearchProjectService {
    public searchInviteMembers$ = new BehaviorSubject<any>(null);

    constructor(private readonly http: HttpClient) {

    }

    /**
    * Функция ищет пользователей для приглашения в команду проекта.
    * @param searchText - Поисковая строка.
    * @returns - Список пользователей, которых можно пригласить в команду проекта.
    */
    public async searchInviteProjectMembersAsync(searchText: string) {
        return await this.http.get(API_URL.apiUrl + `/search/project-members?searchText=${searchText}`).pipe(
            tap(data => this.searchInviteMembers$.next(data))
        );
    };
}
