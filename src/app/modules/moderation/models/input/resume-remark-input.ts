/**
 * Класс входной модели замечаний анкеты.
 */
 export class ResumeRemarkInput {
    /**
     * Название поля.
     */
    fieldName: string = "";

    /**
     * Текст замечания.
     */
    remarkText: string = "";

    /**
     * Id анкеты.
     */
    profileInfoId: number = 0;

    /**
     * Русское название поля.
     */
    russianName: string = "";
}

export class CreateResumeRemarksInput {
    ResumesRemarks: ResumeRemarkInput[] = [];
}