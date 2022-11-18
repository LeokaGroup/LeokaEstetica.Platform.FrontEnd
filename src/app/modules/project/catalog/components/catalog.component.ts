import { Component, OnInit } from "@angular/core";
import { forkJoin } from "rxjs";

@Component({
    selector: "catalog",
    templateUrl: "./catalog.component.html",
    styleUrls: ["./catalog.component.scss"]
})

/**
 * Класс каталога проектов.
 */
export class CatalogProjectsComponent implements OnInit {
    constructor() {
    }

    public async ngOnInit() {
        forkJoin([
        //    await this.getProjectsColumnNamesAsync()
        ]).subscribe();
    };
}