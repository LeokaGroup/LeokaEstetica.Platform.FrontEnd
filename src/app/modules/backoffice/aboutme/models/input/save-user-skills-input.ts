/**
 * Класс входной модели для сохранения выбранных навыков пользователя.
 */
export class SaveUserSkillsInput {
    /**
     * Название навыка.
     */
    SkillName: string = "";

    /**
     * Id навыка.
     */
    SkillId: number = 0;

    /**
     * Системное название навыка.
     */
    SkillSysName: string = "";

    /**
     * Позиция в списке.
     */
    Position: number = 0;

    /**
     * Тэг навыка.
     */
    Tag: string = "";
}