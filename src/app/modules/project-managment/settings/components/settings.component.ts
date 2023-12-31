import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { forkJoin } from "rxjs";
import { ProjectManagmentService } from "../../services/project-managment.service";
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
        private readonly _router: Router) {
    }

    isShowCreateTag: boolean = false;
    isShowCreateStatus: boolean = false;
    tagName: string = "";
    tagDescription: string = "";
    statusName: string = "";

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
           
        ]).subscribe();
    };

    /**
    * Функция создает метку (тег) для задач пользователя.
    */
    public async onCreateUserTaskTagAsync() {
        let userTaskTagInput = new UserTaskTagInput();
        userTaskTagInput.tagName = this.tagName;
        userTaskTagInput.tagDescription = this.tagDescription;

        (await this._projectManagmentService.createUserTaskTagAsync(userTaskTagInput))
            .subscribe(_ => {});
    };
}