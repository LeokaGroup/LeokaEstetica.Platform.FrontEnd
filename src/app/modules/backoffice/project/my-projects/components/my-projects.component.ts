import { Component, OnDestroy, OnInit } from "@angular/core";
import { forkJoin, Subscription } from "rxjs";
import { SignalrService } from "src/app/modules/notifications/signalr/services/signalr.service";
import { MessageService } from "primeng/api";
import { BackOfficeService } from "../../../services/backoffice.service";

@Component({
    selector: "my-projects",
    templateUrl: "./my-projects.component.html",
    styleUrls: ["./my-projects.component.scss"]
})

/**
 * Класс проектов пользователя.
 */
export class MyProjectsComponent implements OnInit, OnDestroy {
    public readonly projectColumns$ = this._backofficeService.projectColumns$;
    public readonly userProjects$ = this._backofficeService.userProjects$;

    allFeedSubscription: any;
    products: any[] = [];
    selectedProjects: any;
    isSelectionPageOnly: boolean = true;

    constructor(private readonly _backofficeService: BackOfficeService,
        private readonly _signalrService: SignalrService,
        private readonly _messageService: MessageService) {

    }

    public async ngOnInit() {
        forkJoin([
           await this.getProjectsColumnNamesAsync(),
           await this.getUserProjectsAsync()
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
    // * Функция получает поля таблицы проектов пользователя.
    // * @returns - Список полей.
    */
    private async getProjectsColumnNamesAsync() {
        (await this._backofficeService.getProjectsColumnNamesAsync())
            .subscribe(_ => {
                console.log("Столбцы таблицы проектов пользователя: ", this.projectColumns$.value);
            });
    };

    /**
     * Функция получает список проектов пользователя.
     * @returns Список проектов.
     */
    private async getUserProjectsAsync() {        
        (await this._backofficeService.getUserProjectsAsync())
        .subscribe(_ => {
            console.log("Проекты пользователя:", this.userProjects$.value);
        });
    };

    /**
     * Функция получает выделенный проект.
     */
    public onSelectProject() {
        console.log(this.selectedProjects);
    };

    public ngOnDestroy(): void {
        (<Subscription>this.allFeedSubscription).unsubscribe();
    };
}