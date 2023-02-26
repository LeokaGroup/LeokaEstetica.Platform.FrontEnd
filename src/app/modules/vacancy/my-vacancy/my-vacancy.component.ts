import { Component, OnInit } from "@angular/core";
import { forkJoin } from "rxjs";
import { SignalrService } from "src/app/modules/notifications/signalr/services/signalr.service";
import { MessageService } from "primeng/api";
import { Router } from "@angular/router";
import { VacancyService } from "../services/vacancy.service";


@Component({
  selector: "my-vacancy",
  templateUrl: "./my-vacancy.component.html",
  styleUrls: ["./my-vacancy.component.scss"]
})

/**
 * Класс список вакансии пользователя.
 */
export class MyVacancyComponent implements OnInit {

  public readonly listVacancy$ = this._vacancyService.listVacancy$;

  allFeedSubscription: any;
  selectedVacancy: any;
  constructor(
    private readonly _signalrService: SignalrService,
    private readonly _messageService: MessageService,
    private readonly _router: Router,
    private readonly _vacancyService:VacancyService) {
  }

  public async ngOnInit() {
    forkJoin([
       await this.getUserVacancyAsync()
    ]).subscribe();

    // Подключаемся.
    this._signalrService.startConnection().then(() => {
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
  };


  /**
   mmmm
   */
  private async getUserVacancyAsync() {
    (await this._vacancyService.getUserVacancysAsync())
      .subscribe(_ => {
        console.log("мой лист вакансии:", this.listVacancy$.value);
      });
  };

}
