import { PaymentData } from "./payment-data";

/**
 * Класс входной модели создания платежа.
 */
export class CreateOrderInput {
    /**
     * Данные карты.
     */
    PaymentData = new PaymentData();

    /**
     * Id тарифа.
     */
    FareRuleId: number = 0;

    /**
     * Почта, на которую отправлять уведомление после оплаты (отправка чеков и уведомление об оплате тарифа).
     */
    Email: string = "";

    /**
     * Признак, нужно ли использовать почту из анкеты пользователя.
     */
    IsProfileEmail: boolean = false;
}