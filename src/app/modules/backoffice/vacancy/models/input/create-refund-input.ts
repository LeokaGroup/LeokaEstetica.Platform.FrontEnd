/**
 * Класс входной модели создания возврата.
 */
export class CreateRefundInput {
    /**
     * Id заказа, по которому будет сделан возврат.
     */
    OrderId: number = 0;

    /**
     * Сумма возврата.
     */
    Price: number = 0;
}