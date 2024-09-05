import { Role } from "../role";

/**
 * Класс входной модели обновления роли.
 */
export class UpdateRoleInput {
  /**
   * Массив ролей.
   */
  roles: Role[] = [];

  /**
   * Id компании.
   */
  projectId: number = 0;

  /**
   * Id проекта.
   */
  companyId: number = 0;
}
