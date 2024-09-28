/**
 * Класс входной модели создания события календаря.
 */
export class CalendarInput {
  /**
   * Название события.
   */
  eventName: string = "";

  /**
   * Описание события.
   */
  eventDescription?: string;

  /**
   * Место проведения события (адрес или место).
   */
  eventLocation?: string;

  /**
   * Дата начала события.
   */
  eventStartDate: Date = new Date();

  /**
   * Дата окончания события.
   */
  eventEndDate: Date = new Date();

  /**
   * Список участников события.
   */
  eventMembers: any[] = [];

  /**
   * Статус.
   */
  calendarEventMemberStatus: string = "";

  /**
   * Id события.
   */
  eventId?: number;
}
