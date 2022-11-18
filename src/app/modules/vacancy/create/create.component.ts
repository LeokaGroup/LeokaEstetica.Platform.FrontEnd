import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { MessageService } from "primeng/api";
import { Subscription } from "rxjs";
import { SignalrService } from "../../notifications/signalr/services/signalr.service";
import { UserService } from "../../user/services/user.service";
import { CreateVacancyInput } from "../models/input/create-vacancy-input";
import { VacancyService } from "../services/vacancy.service";

@Component({
    selector: "create",
    templateUrl: "./create.component.html",
    styleUrls: ["./create.component.scss"]
})

/**
 * Класс компонента создания вакансии.
 */
export class CreateVacancyComponent implements OnInit {
    constructor(private readonly _userService: UserService,
        private readonly _router: Router,
        private readonly _vacancyService: VacancyService,
        private readonly _signalrService: SignalrService,
        private readonly _messageService: MessageService) { }
    public readonly vacancy$ = this._vacancyService.vacancy$;

    vacancyName: string = "";
    vacancyText: string = "";
    workExperience: string = "";
    employment: string = "";
    payment: string = "";
    allFeedSubscription: any;

    public async ngOnInit() {
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
        this._signalrService.listenSuccessCreatedUserVacancyInfo();
    };


   /**
     * Функция регистрирует пользователя.     
     * @returns - Данные пользователя.
     */
    public async onCreateVacancyAsync() {  
        let model = this.CreateVacancyModel();  

        (await this._vacancyService.createVacancyAsync(model))
        .subscribe((response: any) => {
            console.log("Новая вакансия: ", this.vacancy$.value);            

            if (!response.isSuccess) {
                response.errors.forEach((item: any) => {
                    this._messageService.add({ severity: 'error', summary: "Что то не так", detail: item });
                });  
            }

            else {
                setTimeout(() => {
                    this._router.navigate(["/vacancies/catalog"]);
                }, 4000);
            }   
        });
    };

    /**
     * Функция создает модель для создания вакансии.
     * @returns - Входная модель вакансии.
     */
    private CreateVacancyModel(): CreateVacancyInput {
        let model = new CreateVacancyInput();
        model.VacancyName = this.vacancyName;
        model.VacancyText = this.vacancyText;
        model.Employment = this.employment;
        model.Payment = this.payment;
        model.WorkExperience = this.workExperience;

        return model;
    };

    public ngOnDestroy(): void {
        (<Subscription>this.allFeedSubscription).unsubscribe();
    };
}