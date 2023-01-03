import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { forkJoin } from "rxjs";
import { ResumeService } from "../services/resume.service";

@Component({
    selector: "",
    templateUrl: "./catalog.component.html",
    styleUrls: ["./catalog.component.scss"]
})

/**
 * Класс базы резюме.
 */
export class CatalogResumeComponent implements OnInit {
    constructor(private readonly _router: Router,
        private readonly _resumeService: ResumeService) {
    }

    public readonly catalogResumes$ = this._resumeService.catalogResumes$;

    public async ngOnInit() {
        forkJoin([
           await this.loadCatalogResumesAsync()
        ]).subscribe();
    };

     /**
    * Функция получает список базы резюме.
    * @returns - Список базы резюме.
    */
      private async loadCatalogResumesAsync() {    
        (await this._resumeService.loadCatalogResumesAsync())
        .subscribe(_ => {
            console.log("База резюме: ", this.catalogResumes$.value);
        });
    };
}