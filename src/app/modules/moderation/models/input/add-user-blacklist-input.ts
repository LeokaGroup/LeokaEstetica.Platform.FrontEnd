/**
 * Класс входной модели добавления пользователя в ЧС.
 */
export class AddUserBlackListInput {
    /**
     * Id пользователя.
     */
    UserId: number = 0;    

    /**
     * Email.
     */
    Email: string = "";

    /**
     * Номер телефона.
     */
     PhoneNumber: string = "";
}