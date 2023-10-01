import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { MessageService } from "primeng/api";
import { forkJoin } from "rxjs";
import { SignalrService } from "src/app/modules/notifications/signalr/services/signalr.service";
import { OrderFormService } from "../services/order-form.service";

@Component({
    selector: "order-form-info",
    templateUrl: "./order-form-info.component.html",
    styleUrls: ["./order-form-info.component.scss"]
})

/**
 * Класс компонента ФЗ (информация о тарифе).
 */
export class OrderFormInfoComponent implements OnInit {
    constructor(private readonly _router: Router,
        private readonly _activatedRoute: ActivatedRoute,
        private readonly _orderFormService: OrderFormService,
        private readonly _signalrService: SignalrService,
        private readonly _messageService: MessageService) {
    }

    public readonly fareRuleInfo$ = this._orderFormService.fareRuleInfo$;    
    public readonly isEmptyProfile$ = this._orderFormService.isEmptyProfile$;    

    publicId: string = "";
    allFeedSubscription: any;

    public async ngOnInit() {
        forkJoin([
            this.checkUrlParams()
        ]).subscribe();

        // Подключаемся.
        this._signalrService.startConnection().then(async () => {
            console.log("Подключились");

            this.listenAllHubsNotifications();

            // Подписываемся на получение всех сообщений.
            this.allFeedSubscription = this._signalrService.AllFeedObservable
                .subscribe((response: any) => {
                    console.log("Подписались на сообщения", response);
                    this._messageService.add({ severity: response.notificationLevel, summary: response.title, detail: response.message });
                });
        });
    };

     /**
     * Функция слушает все хабы.
     */
   private listenAllHubsNotifications() {
    this._signalrService.listenWarningEmptyUserProfile();
};

    private async checkUrlParams() {
        this._activatedRoute.queryParams
        .subscribe(async params => {
            this.publicId = params["publicId"];   
            await this.getFareRuleInfoAsync();      
          });
    };

    private async getFareRuleInfoAsync() {
        (await this._orderFormService.getFareRuleInfoAsync(this.publicId))
        .subscribe(_ => {
            console.log("Информация о тарифе: ", this.fareRuleInfo$.value);
        });
    };

    public async onRouteNextStepAsync() {
        (await this._orderFormService.isProfileEmptyAsync())
        .subscribe(_ => {
            console.log("Проверка заполнения анкеты: ", this.isEmptyProfile$.value);

            if (!this.isEmptyProfile$.value) {
                this._router.navigate(["/order-form/subscription-plan"], {
                    queryParams: {
                        publicId: this.publicId,
                        step: 2
                    }
                });
            }
        });
    };
}