/**
 * Класс входной модели добавления пользователя в команду проекта.
 */
export class InviteProjectTeamMemberInput {
    /**
     * Id проекта.
     */
    ProjectId: number = 0;

    /**
     * Id вакансии.
     */
    VacancyId: number = 0;

    /**
     * Пользователь.
     */
    User: string = "";
}