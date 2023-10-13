/**
 * Класс входной модели восстановления пароля.
 */
export class RestoreInput {
    /**
     * Пароль для восстановления.
     */
    restorePassword: string = "";

    /**
     * Пользователь.
     */
    userName: string = "";
}