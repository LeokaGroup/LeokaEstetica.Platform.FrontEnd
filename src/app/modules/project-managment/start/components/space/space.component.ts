import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { forkJoin } from "rxjs";
import { RedirectService } from "src/app/common/services/redirect.service";
import { ProjectManagmentService } from "../../../services/project-managment.service";

@Component({
    selector: "",
    templateUrl: "./space.component.html",
    styleUrls: ["./space.component.scss"]
})

/**
 * Класс модуля управления проектами (рабочее пространство).
 */
export class SpaceComponent implements OnInit {
    constructor(private readonly _projectManagmentService: ProjectManagmentService,
        private readonly _router: Router,
        private readonly _redirectService: RedirectService) {
    }
    
    public readonly headerItems$ = this._projectManagmentService.headerItems$;

    isHideAuthButtons: boolean = false;
    aHeaderItems: any[] = [];

    items: any[] = [
        {
            label: 'Заказы',
            command: () => {
                this._router.navigate(["/profile/orders"]);
            }
        },
        // {
        //     label: 'Настройки',
        //     command: () => {

        //     }
        // },       
        {
            label: 'Заявки в поддержку',
            command: () => {
                this._router.navigate(["/profile/tickets"])
            }
        },   
        {
            label: 'Выйти',
            command: () => {
                localStorage.clear();
                this._router.navigate(["/user/signin"]).then(() => {  
                    this._redirectService.redirect("user/signin");                
                });
            }
        }
    ];

    public async ngOnInit() {
        forkJoin([
            await this.getHeaderItemsAsync()
        ]).subscribe();

        this.isHideAuthButtons = localStorage["t_n"] ? true : false;        
    };

    /**
  * Функция получает список элементов меню хидера (верхнее меню).
  * @returns - Список элементов.
  */
    private async getHeaderItemsAsync() {
        (await this._projectManagmentService.getHeaderItemsAsync())
            .subscribe(_ => {
                console.log("Хидер УП: ", this.headerItems$.value);
                this.aHeaderItems = this.headerItems$.value;
            });
    };

    public activeMenu(event: any) {
        console.log(event);
    };
}