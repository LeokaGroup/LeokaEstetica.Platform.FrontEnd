import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
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
        private readonly _redirectService: RedirectService,
        private readonly _activatedRoute: ActivatedRoute) {
    }
    
    public readonly headerItems$ = this._projectManagmentService.headerItems$;
    public readonly workSpaceConfig$ = this._projectManagmentService.workSpaceConfig$;

    isHideAuthButtons: boolean = false;
    aHeaderItems: any[] = [];
    selectedProjectId: number = 0;
    selectedStrategy: string = "";
    selectedTemplateId: number = 0;
    aStatuses: any[] = [];

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
            this.checkUrlParams(),
            await this.getHeaderItemsAsync(),
            await this.getConfigurationWorkSpaceBySelectedTemplateAsync()
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

    private async checkUrlParams() {
        this._activatedRoute.queryParams
          .subscribe(async params => {
            this.selectedProjectId = params["projectId"];
            this.selectedStrategy = params["view"];
            this.selectedTemplateId = params["tm"];
          });
      };

      /**
    * Функция получает конфигурацию рабочего пространства по выбранному шаблону.
    * Под конфигурацией понимаются основные элементы рабочего пространства (набор задач, статусов, фильтров, колонок и тд)
    * если выбранный шаблон это предполагает.
    * @returns - Данные конфигурации.
    */
    private async getConfigurationWorkSpaceBySelectedTemplateAsync() {
        (await this._projectManagmentService.getConfigurationWorkSpaceBySelectedTemplateAsync(this.selectedProjectId,
            this.selectedStrategy, this.selectedTemplateId))
            .subscribe(_ => {
                console.log("Конфигурация рабочего пространства: ", this.workSpaceConfig$.value);
            });
    };

    public onSelectTask(taskId: number, projectTaskId: number) {
        this._projectManagmentService.selectedTaskId = taskId;

        let projectId = this.selectedProjectId;

        this._router.navigate(["/project-management/space/details"], {
            queryParams: {
                projectId,
                taskId: projectTaskId
            }
        });
    };
}