/**
 * Класс роли пользователя.
 */
export class Role {
  /**
   * Id роли.
   */
  roleId: number = 0;

  /**
   * Признак активной роли у участника проекта компании.
   */
  isEnabled: boolean = false;

  /**
   * Id пользователя.
   */
  userId: number = 0;
}
