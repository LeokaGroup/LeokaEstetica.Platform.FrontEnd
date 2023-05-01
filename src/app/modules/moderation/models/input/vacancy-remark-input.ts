/**
 * Класс входной модели замечаний к вакансии.
 */
 export class VacancyRemarkInput {
    /**
     * Название поля.
     */
    fieldName: string = "";

    /**
     * Текст замечания.
     */
    remarkText: string = "";

    /**
     * Id вакансии.
     */
    vacancyId: number = 0;

    /**
     * Русское название поля.
     */
    russianName: string = "";
}

export class CreateVacancyRemarksInput {
    VacanciesRemarks: VacancyRemarkInput[] = [];
}