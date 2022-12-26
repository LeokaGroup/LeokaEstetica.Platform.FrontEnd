/**
 * Класс входной модели для создания комментария к проекту.
 */
export class CreateProjectCommentInput {
    /**
     * Id комментария.
     */
    ProjectId: number = 0;

    /**
     * Комментарий.
     */
    Comment: string = "";
}