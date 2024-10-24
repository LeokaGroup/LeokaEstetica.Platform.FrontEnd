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

  // Условия.
  Conditions: string = "";

  // Требования
  Demands: string = "";

  // Видимость проекта
  isPublic: boolean = true;

  /**
   * Id компании.
   */
  companyId?: number;
}
