/**
 * Класс входной модели создания сообщения тикета.
 */
export class CreateTicketMessageInput {
    /**
     * Id тикета.
     */
    ticketId: number = 0;

    /**
     * Сообщение тикета.
     */
    message: string = "";
}