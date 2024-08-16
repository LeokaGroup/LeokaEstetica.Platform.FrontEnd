import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { forkJoin } from "rxjs";
import { ProjectManagmentService } from "../../services/project-managment.service";
import { CreateTaskStatusInput } from "../../task/models/input/create-task-status-input";
import { UserTaskTagInput } from "../../task/models/input/user-task-tag-input";

@Component({
    selector: "",
    templateUrl: "./settings.component.html",
    styleUrls: ["./settings.component.scss"]
})

/**
 * Класс компонента модуля управления проектами (настройки).
 */
export class SettingsProjectManagmentComponent implements OnInit {
    constructor(private readonly _projectManagmentService: ProjectManagmentService,
        private readonly _router: Router,
        private readonly _activatedRoute: ActivatedRoute) {
    }

    public readonly templateStatuses$ = this._projectManagmentService.templateStatuses$;

    isShowCreateTag: boolean = false;
    isShowCreateStatus: boolean = false;
    tagName: string = "";
    tagDescription: string = "";
    statusName: string = "";
    statusDescription: string = "";
    projectId: number = 0;
    selectedAssociationStatusSysName: any;

    items: any[] = [{
        label: 'Рабочие процессы',
        items: [{
            label: 'Статусы',
            command: () => {
                this.isShowCreateStatus = true;
                this.isShowCreateTag = false;
            }
        },
        {
            label: 'Метки (теги)',
            command: () => {
                this.isShowCreateTag = true;
                this.isShowCreateStatus = false;
            }
        }
        ]
    }];

    public async ngOnInit() {
        forkJoin([
           this.checkUrlParams()
        ]).subscribe();
    };

    private async checkUrlParams() {
        this._activatedRoute.queryParams
            .subscribe(async params => {
                console.log("params: ", params);

                this.projectId = params["projectId"];
            });
    };

    /**
    * Функция создает метку (тег) для задач пользователя.
    */
    public async onCreateUserTaskTagAsync() {
        let userTaskTagInput = new UserTaskTagInput();
        userTaskTagInput.tagName = this.tagName;
        userTaskTagInput.tagDescription = this.tagDescription;
        userTaskTagInput.projectId = this.projectId;

        (await this._projectManagmentService.createUserTaskTagAsync(userTaskTagInput))
            .subscribe(_ => {
              this.tagName = '';
              this.tagDescription = '';
            });
    };

    /**
    * Функция получает статусы шаблона для определения категории при создании статуса.
    * Статусы выводятся в рамках шаблона.
    * @returns - Список статусов.
    */
     public async onGetProjectTemplateStatusesAsync() {
        (await this._projectManagmentService.getProjectTemplateStatusesAsync(this.projectId))
            .subscribe(_ => {
                console.log("Статусы шаблона проекта для выбора: ", this.templateStatuses$.value);
            });
    };

    /**
    * Функция создает новый статус шаблона пользователя учитывая ассоциацию статуса.
    */
     public async onCreateUserTaskStatusTemplateAsync() {
        let createTaskStatusInput = new CreateTaskStatusInput();
        createTaskStatusInput.statusName = this.statusName;
        createTaskStatusInput.statusDescription = this.statusDescription;
        createTaskStatusInput.projectId = this.projectId;
        createTaskStatusInput.associationStatusSysName = this.selectedAssociationStatusSysName.statusSysName;

        (await this._projectManagmentService.createUserTaskStatusTemplateAsync(createTaskStatusInput))
            .subscribe(_ => {
                this.statusName = "";
                this.statusDescription = "";

                // TODO: Очищать тоже надо сбрасывать. Какой-нить setDefaultValue тут подошел бы.
                // this.selectedAssociationStatusSysName = null;
            });
    };
}
