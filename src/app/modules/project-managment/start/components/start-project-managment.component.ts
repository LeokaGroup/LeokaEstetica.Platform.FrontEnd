import { Component, OnInit } from "@angular/core";
import { forkJoin } from "rxjs";

@Component({
    selector: "",
    templateUrl: "./start-project-managment.component.html",
    styleUrls: ["./start-project-managment.component.scss"]
})

/**
 * Класс модуля управления проектами (начальная страница, не Landing).
 */
export class StartProjectManagmentComponent implements OnInit {
    constructor() {
    }

    public async ngOnInit() {
        forkJoin([
          
        ]).subscribe();
    };
}