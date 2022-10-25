/**
 * Класс входной модели для сохранения данных профиля пользователя.
 */
export class ProfileInfoInput {
    /**
     * Фамилия.
     */
    LastName!: string;

    /**
     * Имя.
     */
    FirstName!: string;

    /**
     * Отчество.
     */
    Patronymic!: string;

    /**
     * Отображать ли первую букву фамилии.
     */
    IsShortFirstName!: boolean;

    /**
     * Ссылка на телегу либо ник.
     */
    Telegram!: string;

    /**
     * Ватсап номер телефона.
     */
    WhatsApp!: string;

    /**
     * Ссылка на ВК либо ник.
     */
    Vkontakte!: string;

    /**
     * Ссылка на другую соц.сеть.
     */
    OtherLink!: string;

    /**
     * Обо мне.
     */
    Aboutme!: string;

    /**
     * Должность.
     */
    Job!: string;

    /**
     * Email.
     */
    Email!: string;

    /**
     * Номер телефона.
     */
    PhoneNumber!: string;
}