import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { API_URL } from 'src/app/core/core-urls/api-urls';
import { CreateVacancyInput } from '../models/input/create-vacancy-input';

@Injectable()
export class VacancyService {
    public vacancy$ = new BehaviorSubject<any>(null);

    constructor(private readonly http: HttpClient) {

    }

    /**
     * Функция создает новую вакансию.
     * @returns - Данные вакансии.
     */
    public async createVacancyAsync(createVacancyInput: CreateVacancyInput) {
        return await this.http.post(API_URL.apiUrl + "/vacancies/vacancy", createVacancyInput).pipe(
            tap(data => this.vacancy$.next(data))
        );
    };
}