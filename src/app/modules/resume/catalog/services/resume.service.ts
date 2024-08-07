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
    public pagination$ = new BehaviorSubject<any>(null);
    public access$ = new BehaviorSubject<any>(null);

    constructor(private readonly http: HttpClient) {

    }

    /**
    * Функция получает список базы резюме.
    * @returns - Список базы резюме.
    */
    public async loadCatalogResumesAsync() {
        return await this.http.get(API_URL.apiUrl + "/resumes/catalog").pipe(
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

    /**
     * Функция пагинации резюме.
     * @param page - Номер страницы.
     * @param lastId - Id последней записи из выборки пагинации.
     * @returns - Список резюме.
     */
     public async getResumesPaginationAsync(page: number, lastId: number | null = null) {
       if (lastId !== null) {
         // Надо инкрементить, так как event.page по дефолту имеет 0 для 1 элемента.
         return await this.http.get(API_URL.apiUrl + `/resumes/pagination?page=${page + 1}&lastId=${lastId}`).pipe(
           tap(data => this.pagination$.next(data))
         );
       }

        // Надо инкрементить, так как event.page по дефолту имеет 0 для 1 элемента.
        return await this.http.get(API_URL.apiUrl + `/resumes/pagination?page=${page + 1}`).pipe(
            tap(data => this.pagination$.next(data))
        );
    };

    /**
     * Функция проверяет доступ к базе резюме.
     * @returns - Доступ.
     */
     public async checkAvailableAccessResumesAsync() {
        return await this.http.get(API_URL.apiUrl + `/resumes/access`).pipe(
            tap(data => this.access$.next(data))
        );
    };
}
