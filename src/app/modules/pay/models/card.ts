/**
 * Класс модели описывает данные карты.
 */
export class Card {
    /**
     * Номер карты.
     */
     Pan: string = "";

     /**
      * Срок действия карты.
      */
     Expiry: string = "";

     /**
      * Cvc-код.
      */
     Cvc: string = "";
}