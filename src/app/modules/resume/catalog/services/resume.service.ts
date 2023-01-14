import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { API_URL } from 'src/app/core/core-urls/api-urls';

/**
 * Класс сервиса базы резюме.
 */
@Injectable()
export class ResumeService {
    public catalogResumes$ = new BehaviorSubject<any>(null);

    constructor(private readonly http: HttpClient) {

    }

    /**
    * Функция получает список базы резюме.
    * @returns - Список базы резюме.
    */
    public async loadCatalogResumesAsync() {
        return await this.http.get(API_URL.apiUrl + "/resumes").pipe(
            tap(data => this.catalogResumes$.next(data))
        );
    };

    /**
     * Функция ищет резюме по поисковому запросу.
     * @param searchText - Поисковая строка.
     * @returns - Список резюме после поиска.
     */
     public async searchResumesAsync(searchText: string) {
        return await this.http.get(API_URL.apiUrl + "/resumes/search?searchText=" + searchText).pipe(
            tap(data => this.catalogResumes$.next(data))
        );
    };
}