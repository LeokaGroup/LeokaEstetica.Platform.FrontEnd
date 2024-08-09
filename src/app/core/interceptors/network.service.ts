import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable()
export class NetworkService {
    private _loading = new BehaviorSubject<boolean>(false);
    public readonly loading$ = this._loading;
    public isNotifyProcessed: boolean = false;

    /**
     * Функция ставит бизи или снимает.
     * @param isBusy - Флаг бизи.
     */
    public setBusy(isBusy: boolean) {
        this._loading.next(isBusy);
    };
}
