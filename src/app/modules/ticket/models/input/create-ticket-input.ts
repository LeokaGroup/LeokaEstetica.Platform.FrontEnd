/**
 * Класс входной модели создания тикета.
 */
export class CreateTicketInput {
    /**
     * Название тикета.
     */
    title: string = "";

    /**
     * Сообщение тикета.
     */
    message: string = "";
}