/**
 * Класс входной модели прикрепления вакансии к проекту.
 */
export class AttachProjectVacancyInput {
    /**
     * Id проекта.
     */
    ProjectId: number = 0;

    /**
     * Id вакансии.
     */
    VacancyId: number = 0;
}