import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { API_URL } from 'src/app/core/core-urls/api-urls';

type UserInviteResponse = {
  userId: number,
  displayName: string | null
}

/**
 * Класс сервиса поиска в проектах.
 */
@Injectable()
export class SearchProjectService {
    public searchInviteMembers$ = new BehaviorSubject<UserInviteResponse | null>(null);

    constructor(private readonly http: HttpClient) {}

    /**
    * Функция ищет пользователей для приглашения в команду проекта.
    * @param searchText - Поисковая строка.
    * @returns - Список пользователей, которых можно пригласить в команду проекта.
    */
    public searchInviteProjectMembersAsync(searchText: string) {
      return this.http.get(API_URL.apiUrl + `/search/project-members?searchText=${searchText}`).pipe(
            tap((data) => {
              if (typeof data === 'object' && data.hasOwnProperty('userId') && data.hasOwnProperty('displayName')) {
                this.searchInviteMembers$.next(data as UserInviteResponse)
              } else {
                this.searchInviteMembers$.next(null)
                console.error("Wrong response data type")
              }
            })
        );
    };
}
