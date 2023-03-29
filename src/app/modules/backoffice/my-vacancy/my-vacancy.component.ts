import { Component, OnInit } from "@angular/core";
import { forkJoin } from "rxjs";
import { SignalrService } from "src/app/modules/notifications/signalr/services/signalr.service";
import { MessageService } from "primeng/api";
import { Router } from "@angular/router";
import { VacancyService } from "../../vacancy/services/vacancy.service";
import { BackOfficeService } from "../services/backoffice.service";
import { RedirectService } from "src/app/common/services/redirect.service";


@Component({
  selector: "my-vacancy",
  templateUrl: "./my-vacancy.component.html",
  styleUrls: ["./my-vacancy.component.scss"]
})

/**
 * Класс список вакансии пользователя.
 */
export class MyVacancyComponent implements OnInit {

  public readonly listVacancy$ = this._backofficeService.listVacancy$;
  public readonly deleteVacancy$ = this._backofficeService.deleteVacancy$;

  allFeedSubscription: any;
  selectedVacancy: any;
  vacancyId: number = 0;
  vacancyName: string = "";
  isDeleteVacancy: boolean = false;
  
  constructor(
    private readonly _signalrService: SignalrService,
    private readonly _messageService: MessageService,
    private readonly _router: Router,
    private readonly _backofficeService: BackOfficeService,
    private readonly _vacancyService: VacancyService,
    private readonly _redirectService: RedirectService) {
  }

  public async ngOnInit() {
    forkJoin([
       await this.getUserVacanciesAsync()
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
    this._signalrService.listenSuccessDeleteVacancy();
    this._signalrService.listenSendErrorDeleteVacancy();
  };



  /**
   Получавем список(List) ваканции клиента
   */
  private async getUserVacanciesAsync () {
    (await this._backofficeService.getUserVacancysAsync())
      .subscribe(_ => {
        console.log("мой лист вакансии:", this.listVacancy$.value);
      });
  };

  /**
   * Функция переходит на страницу просмотра вакансии и подставляет в роут Id вакансии.
   * @param vacancyId - Id вакансии.
   */
  public onRouteViewVacancy(vacancyId: number) {
    this._router.navigate(["/vacancies/vacancy"], {
      queryParams: {
        vacancyId,
        mode: "view"
      }
    });
  };

  /**
   * Функция переходит на страницу редактирования вакансии и подставляет в роут Id вакансии.
   * @param vacancyId - Id вакансии.
   */
  public onRouteEditVacancy(vacancyId: number) {
    this._router.navigate(["/vacancies/vacancy"], {
      queryParams: {
        vacancyId,
        mode: "edit"
      }
    });
  };

  /**
   * Функция удаляет вакансию.
   * @param vacancyId - Id вакансии.
   */
  public async onDeleteVacancyInMenuAsync() {
    (await this._vacancyService.deleteVacancyAsync(this.vacancyId))
      .subscribe(async (response: any) => {
        console.log("Удалили вакансию: ", response);
        this.isDeleteVacancy = false;
        
        await this.getUserVacanciesAsync();
      });
  };

  public onBeforeDeleteVacancy(vacancyId: number, vacancyName: string) {
    this.vacancyId = vacancyId;
    this.vacancyName = vacancyName;
    this.isDeleteVacancy = true;
  };
}
