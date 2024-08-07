import {Component, OnDestroy, OnInit} from "@angular/core";
import { forkJoin, Subscription } from "rxjs";
import { MessageService } from "primeng/api";
import { Router } from "@angular/router";
import { VacancyService } from "../vacancy/services/vacancy.service";
import { BackOfficeService } from "../services/backoffice.service";
import { AddVacancyArchiveInput } from "../models/input/vacancy/add-vacancy-archive-input";


@Component({
  selector: "my-vacancy",
  templateUrl: "./my-vacancy.component.html",
  styleUrls: ["./my-vacancy.component.scss"]
})

/**
 * Класс список вакансии пользователя.
 */
export class MyVacancyComponent implements OnInit, OnDestroy {

  public readonly listVacancy$ = this._backofficeService.listVacancy$;
  public readonly deleteVacancy$ = this._backofficeService.deleteVacancy$;
  public readonly archivedVacancy$ = this._backofficeService.archivedVacancy$;

  allFeedSubscription: any;
  selectedVacancy: any;
  vacancyId: number = 0;
  vacancyName: string = "";
  isDeleteVacancy: boolean = false;
  subscription?: Subscription;

  constructor(
    private readonly _messageService: MessageService,
    private readonly _router: Router,
    private readonly _backofficeService: BackOfficeService,
    private readonly _vacancyService: VacancyService) {
  }

  public async ngOnInit() {
    forkJoin([
       await this.getUserVacanciesAsync()
    ]).subscribe();
  };

  /**
   Получавем список ваканций.
   */
  private async getUserVacanciesAsync () {
    (await this._backofficeService.getUserVacancysAsync())
      .subscribe(_ => {
        console.log("Список вакансий:", this.listVacancy$.value);
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

  /**
   * Функция добавляет вакансию в архив.
   * @param vacancyId - Id вакансии.
   */
   public async onAddArchiveVacancyAsync(vacancyId: number) {
    let vacancyArchiveInput = new AddVacancyArchiveInput();
    vacancyArchiveInput.vacancyId = vacancyId;

    (await this._vacancyService.addArchiveVacancyAsync(vacancyArchiveInput))
      .subscribe(async _ => {
        console.log("Вакансия добавлена в архив", this.archivedVacancy$.value);

        await this.getUserVacanciesAsync();
      });
  };

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}
