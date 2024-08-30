import {Component, OnDestroy, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {ConfirmationService, MessageService} from "primeng/api";
import { Subscription } from "rxjs";
import { RedirectService } from "src/app/common/services/redirect.service";
import { BackOfficeService } from "../../services/backoffice.service";
import { CreateProjectVacancyInput } from "../models/input/create-project-vacancy-input";
import { VacancyInput } from "../models/input/vacancy-input";
import { VacancyService } from "../services/vacancy.service";
import {OrderService} from "../../../order-form/services/order.service";

@Component({
    selector: "create",
    templateUrl: "./create.component.html",
    styleUrls: ["./create.component.scss"]
})

/**
 * Класс компонента создания вакансии.
 */
export class CreateVacancyComponent implements OnInit, OnDestroy {
  constructor(private readonly _router: Router,
              private readonly _vacancyService: VacancyService,
              private readonly _messageService: MessageService,
              private readonly _activatedRoute: ActivatedRoute,
              private readonly _backofficeService: BackOfficeService,
              private readonly _redirectService: RedirectService,
              private _confirmationService: ConfirmationService,
              private readonly _orderService: OrderService) {
  }
    public readonly vacancy$ = this._vacancyService.vacancy$;
    public readonly userProjects$ = this._backofficeService.userProjects$;

    vacancyName: string = "";
    vacancyText: string = "";
    payment: number = 0;
    allFeedSubscription: any;
    projectId: number = 0;
    selectedExpirience: any = "";
    selectedEmployments: any = "";
    expirienceVariants: any= [
        { name: "Не имеет значения" },
        { name: "От 3 до 6 лет" },
        { name: "От 1 года до 3 лет" },
        { name: "Более 6 лет" },
        { name: "Нет опыта " }
    ];
    employmentsVariants: any= [
        { name: "Полная занятость" },
        { name: "Частичная занятость" }
    ];
    selectedProject: any;
    demands: string = "";
    conditions: string = "";
    subscription?: Subscription;
    isNeedUserAction: boolean = false;

    public async ngOnInit() {
        this.checkUrlParams();
        await this.getUserProjectsAsync();
    };

   /**
     * Функция создает вакансию отдельно либо вакансию проекта и прикрепляет ее спразу к нему.
     * @returns - Данные вакансии.
     */
    public async onCreateVacancyAsync() {
        if (!this.projectId) {
            this.createVacancyAsync();
        }

        else {
            this.createProjectVacancyAsync();
        }
    };

    /**
     * Функция создает вакансию вне проекта.
     * @returns - Данные вакансии.
     */
    private async createVacancyAsync() {
      (await this._orderService.calculatePricePostVacancyAsync())
        .subscribe((response: any) => {
          console.log("calculated price: ", response);

          if (response.isNeedUserAction && !this.isNeedUserAction) {
            this.isNeedUserAction = response.isNeedUserAction;

            this._confirmationService.confirm({
              message: `Стоимость публикации вакансии в соответствии с вашим текущим тарифом: ${response.price} ${response.fees.feesMeasure}. </br>
                        Перейти к оплате?`,
              header: 'Публикация вакансии',
              icon: 'pi pi-exclamation-triangle',
              acceptIcon:"none",
              rejectIcon:"none",
              acceptButtonStyleClass:"p-button-text p-button-success",
              rejectButtonStyleClass:"p-button-text p-button-danger",
              acceptLabel: "Оплатить и опубликовать",
              rejectLabel: "Отменить",
              accept: async () => {
                let model = this.createVacancyModel();
                (await this._vacancyService.createVacancyAsync(model))
                  .subscribe((response: any) => {
                    console.log("Новая вакансия: ", this.vacancy$.value);

                    if (response.errors !== null && response.errors.length > 0) {
                      response.errors.forEach((item: any) => {
                        this._messageService.add({
                          severity: "error",
                          summary: "Что то не так. Но не волнуйтесь, мы сохранили вашу вакансию.",
                          detail: item.errorMessage
                        });
                      });
                    } else {
                      setTimeout(() => {
                        this._router.navigate(["/vacancies/my"]).then(() => {
                          this._redirectService.redirect("vacancies/my");
                        });
                      }, 4000);
                    }
                  });
              },
              reject: () => {
                this.isNeedUserAction = false;
              }
            });
          }
        });
    };

    /**
     * Функция создает вакансию вне проекта.
     * @returns - Данные вакансии.
     */
     private async createProjectVacancyAsync() {
        let model = this.createProjectVacancyModel();
        (await this._vacancyService.createProjectVacancyAsync(model))
        .subscribe((response: any) => {
            console.log("Новая вакансия проекта: ", this.vacancy$.value);

            if (response.errors !== null && response.errors.length > 0) {
                response.errors.forEach((item: any) => {
                    this._messageService.add({ severity: "error", summary: "Что то не так", detail: item.errorMessage });
                });
            }

            else {
                setTimeout(() => {
                    let projectId = this.projectId;
                    this._router.navigate(["/projects/project"], {
                        queryParams: {
                            projectId,
                            mode: "view"
                        }
                    });
                }, 4000);
            }
        });
    };

    /**
     * Функция создает модель для создания вакансии вне проекта.
     * @returns - Входная модель вакансии.
     */
    private createVacancyModel(): VacancyInput {
        let model = new VacancyInput();
        model.VacancyName = this.vacancyName;
        model.VacancyText = this.vacancyText;
        model.WorkExperience = this.selectedExpirience.name;
        model.Employment = this.selectedEmployments.name;
        model.Payment = this.payment.toString();
        model.ProjectId = this.selectedProject.projectId;
        model.Conditions = this.conditions;
        model.Demands = this.demands;

        return model;
    };

    /**
     * Функция создает модель для создания вакансии проекта.
     * @returns - Входная модель вакансии.
     */
     private createProjectVacancyModel(): CreateProjectVacancyInput {
        let model = new CreateProjectVacancyInput();
        model.VacancyName = this.vacancyName;
        model.VacancyText = this.vacancyText;
        model.WorkExperience = this.selectedExpirience.name;
        model.Employment = this.selectedEmployments.name;
        model.Payment = this.payment.toString();
        model.ProjectId = this.projectId;

        return model;
    };

    private checkUrlParams() {
        this._activatedRoute.queryParams
        .subscribe(params => {
            // Если в роуте есть Id проекта, то идет создание вакансии проекта, а не отдельно.
            if (params["projectId"]) {
                this.projectId = params["projectId"];
            }
          });
    };

    /**
     * Функция получает список проектов пользователя.
     * @returns Список проектов.
     */
     private async getUserProjectsAsync() {
        (await this._backofficeService.getUserProjectsAsync(true))
        .subscribe(_ => {
            console.log("Проекты пользователя:", this.userProjects$.value);
        });
    };

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}
