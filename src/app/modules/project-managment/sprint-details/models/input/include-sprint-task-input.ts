export class IncludeTaskSprintInput {
  /**
   * Id спринта.
   */
  epicSprintId: string = "";

  /**
   * Id задач в рамках проекта.
   */
  projectTaskIds: string[] = [];

  /**
   * Id проекта.
   */
  projectId: number = 0;
}
