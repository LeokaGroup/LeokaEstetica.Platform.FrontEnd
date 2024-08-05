import {Component, OnDestroy, OnInit} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { MessageService } from "primeng/api";
import { forkJoin, Subscription } from "rxjs";
import { RedirectService } from "src/app/common/services/redirect.service";
import { VacancyService } from "src/app/modules/backoffice/vacancy/services/vacancy.service";
import { VacancyInput } from "../models/input/vacancy-input";

@Component({
    selector: "detail",
    templateUrl: "./detail.component.html",
    styleUrls: ["./detail.component.scss"]
})

/**
 * Класс деталей вакансии (используется для изменения и просмотра вакансии).
 */
export class DetailVacancyComponent implements OnInit, OnDestroy {
    constructor(private readonly _activatedRoute: ActivatedRoute,
        private readonly _messageService: MessageService,
        private readonly _vacancyService: VacancyService,
        private readonly _router: Router,
        private readonly _redirectService: RedirectService) {
    }

    public readonly selectedVacancy$ = this._vacancyService.selectedVacancy$;
    public readonly deleteVacancy$ = this._vacancyService.deleteVacancy$;
    public readonly vacancyRemarks$ = this._vacancyService.vacancyRemarks$;

    projectName: string = "";
    projectDetails: string = "";
    allFeedSubscription: any;
    isEditMode: boolean = false;
    isEdit: any;
    selectedVacancy: any;
    vacancyName: string = "";
    vacancyText: string = "";
    workExperience: string = "";
    employment: string = "";
    payment: string = "";
    vacancyId: number = 0;
    isDeleteVacancy: boolean = false;
    isVisibleDeleteButton: boolean = false;
    isVisibleSaveButton: boolean = false;
    isVisibleEditButton: boolean = false;
    demands: string = "";
    conditions: string = "";
    isVisibleActionAddVacancyArchive: boolean = false;
    isShowRemarks: boolean = false;
    aVacancyRemarks: any[] = [];
    subscription?: Subscription;

    public async ngOnInit() {
        forkJoin([
        this.checkUrlParams(),
        await this.getVacancyRemarksAsync()
        ]).subscribe();
    };

    private checkUrlParams() {
        this._activatedRoute.queryParams
        .subscribe(params => {
            let mode = params["mode"];

            if (mode == "view") {
                this.getVacancyByIdAsync(params["vacancyId"], "View");
                this.isEditMode = false;
            }

            if (mode == "edit") {
                this.getVacancyByIdAsync(params["vacancyId"], "Edit");
                this.isEditMode = true;
            }

            this.vacancyId = params["vacancyId"];
          });
    };

    public onSelectVacancy() {
        console.log(this.selectedVacancy);
    };

    /**
     * Функция получает вакансию.
     * @param vacancyId - Id вакансии.
     */
    private async getVacancyByIdAsync(vacancyId: number, mode: string) {
        (await this._vacancyService.getVacancyByIdAsync(vacancyId, mode))
            .subscribe(async _ => {
                console.log("Получили вакансию: ", this.selectedVacancy$.value);

                // Нет доступа к вакансии.
                if (!this.selectedVacancy$.value.isAccess) {
                    this._router.navigate(["/forbidden"]);
                    return;
                }

                this.vacancyName = this.selectedVacancy$.value.vacancyName;
                this.vacancyText = this.selectedVacancy$.value.vacancyText;
                this.workExperience = this.selectedVacancy$.value.workExperience;
                this.employment = this.selectedVacancy$.value.employment;
                this.payment = this.selectedVacancy$.value.payment;
                this.conditions = this.selectedVacancy$.value.conditions;
                this.demands = this.selectedVacancy$.value.demands;
                this.isVisibleDeleteButton = this.selectedVacancy$.value.isVisibleDeleteButton;
                this.isVisibleSaveButton = this.selectedVacancy$.value.isVisibleSaveButton;
                this.isVisibleEditButton = this.selectedVacancy$.value.isVisibleEditButton;
                this.isVisibleActionAddVacancyArchive = this.selectedVacancy$.value.isVisibleActionAddVacancyArchive;
                this.isShowRemarks = this.selectedVacancy$.value.vacancyRemarks.length > 0;
            });
    };

    /**
     * Функция удаляет вакансию.
     * @param vacancyId - Id вакансии.
     */
    public async onDeleteVacancyAsync() {
        (await this._vacancyService.deleteVacancyAsync(this.vacancyId))
            .subscribe(async _ => {
                console.log("Удалили вакансию: ", this.deleteVacancy$.value);
                this.isDeleteVacancy = false;

                setTimeout(() => {
                    this._router.navigate(["/vacancies"])
                    .then(() => {
                        this._redirectService.redirect("/vacancies/my");
                    });
                }, 4000);
            });
    };

    public onEditVacancy(): void {
        let vacancyId = this.vacancyId;

        this._router.navigate(["/vacancies/vacancy"], {
            queryParams: {
                vacancyId,
                mode: "edit"
            }
        });
    };

    /**
      * TODO: Вынести куда-нибудь, а то дублируется с вакансиями вне проекта.
     * Функция обновляет вакансию.
     * @returns - Данные вакансии.
     */
     public async onUpdateVacancyAsync() {
        let model = this.createUpdateVacancyModel();

        (await this._vacancyService.updateVacancyAsync(model))
        .subscribe((response: any) => {
            if (response.errors !== null && response.errors.length > 0) {
                response.errors.forEach((item: any) => {
                    this._messageService.add({ severity: 'error', summary: "Что то не так", detail: item.errorMessage });
                });
            } else {
              setTimeout(() => {
                  this._router.navigate(["/vacancies/my"]).then(() => {
                      this._redirectService.redirect("vacancies/my");
                    });
              }, 4000);
          }
        });
    };

    /**
     * TODO: Вынести куда-нибудь, а то дублируется с вакансиями вне проекта.
     * Функция создает модель для обновления вакансии проекта.
     * @returns - Входная модель вакансии.
     */
     private createUpdateVacancyModel(): VacancyInput {
        let model = new VacancyInput();
        model.VacancyName = this.vacancyName;
        model.VacancyText = this.vacancyText;
        model.Employment = this.employment;
        model.Payment = this.payment;
        model.WorkExperience = this.workExperience;
        model.VacancyId = this.vacancyId;
        model.Conditions = this.conditions;
        model.Demands = this.demands;

        return model;
    };

    /**
 * Функция получает список замечаний вакансии.
 * @param vacancyId - Id вакансии.
 * @returns - Список замечаний вакансии.
 */
    private async getVacancyRemarksAsync() {
        (await this._vacancyService.getVacancyRemarksAsync(this.vacancyId))
            .subscribe(async _ => {
                this.aVacancyRemarks = this.vacancyRemarks$.value;
                console.log("Список замечаний вакансии: ", this.aVacancyRemarks);
            });
    };

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}
