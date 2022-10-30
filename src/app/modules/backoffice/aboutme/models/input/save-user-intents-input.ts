/**
 * Класс входной модели для сохранения выбранных целей пользователя.
 */
export class SaveUserIntentsInput {
    /**
     * Id цели.
     */
    IntentId: number = 0;

    /**
     * Название цели.
     */
    IntentName: string = "";

    /**
     * Системное название цели.
     */
    IntentSysName: string = "";

    /**
     * Позиция.
     */
    Position: number = 0;
}