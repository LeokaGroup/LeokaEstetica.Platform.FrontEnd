/**
 * Класс входной модели для создания проекта.
 */
export class CreateProjectInput {
    /**
     * Название проекта.
     */
    ProjectName: string = "";

    /**
     * Описание проекта.
     */
    ProjectDetails: string = "";

    // Системное название стадии проекта.
    ProjectStage: string = "";
}