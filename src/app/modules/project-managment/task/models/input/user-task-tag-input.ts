/**
 * Класс входной модели тегов задачи пользователя.
 */
export class UserTaskTagInput {
    /**
     * Название метки (тега).
     */
    tagName: string = "";

    /**
     * Описание метки (тега).
     */
    tagDescription: string = "";
}