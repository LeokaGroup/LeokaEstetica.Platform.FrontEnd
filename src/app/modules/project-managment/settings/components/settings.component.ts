import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { forkJoin } from "rxjs";
import { ProjectManagmentService } from "../../services/project-managment.service";

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

    items: any[] = [{
        label: 'Workflows',
        items: [{
            label: 'Статусы',
            command: () => {
            }
        },
        {
            label: 'Метки (теги)',
        }
        ]
    }];

    public async ngOnInit() {
        forkJoin([
           
        ]).subscribe();
    };
}