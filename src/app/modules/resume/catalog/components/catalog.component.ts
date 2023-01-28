import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { forkJoin } from "rxjs";
import { BackOfficeService } from "src/app/modules/backoffice/services/backoffice.service";
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
        private readonly _resumeService: ResumeService,
        private readonly _activatedRoute: ActivatedRoute,
        private readonly _backOfficeService: BackOfficeService) {
    }

    public readonly catalogResumes$ = this._resumeService.catalogResumes$;
    public readonly pagination$ = this._resumeService.pagination$;

    aResumesCatalog: any[] = [];
    searchText: string = "";
    page: number = 0;
    rowsCount: number = 0;

    public async ngOnInit() {
        forkJoin([
           await this.loadCatalogResumesAsync(),
           this.checkUrlParams(),
           await this.initResumesPaginationAsync()
        ]).subscribe();
    };

    private setUrlParams(page: number) {
        this._router.navigate(["/resumes"], {
            queryParams: {
                page: page
            }
        });
    };

    private checkUrlParams() {
        this._activatedRoute.queryParams
        .subscribe(params => {
            console.log("params: ", params);
            this.page = params["page"]
            console.log("page: ", this.page);
          });
    };

     /**
    * Функция получает список базы резюме.
    * @returns - Список базы резюме.
    */
      private async loadCatalogResumesAsync() {    
        (await this._resumeService.loadCatalogResumesAsync())
        .subscribe(_ => {
            console.log("База резюме: ", this.catalogResumes$.value);
            this.aResumesCatalog = this.catalogResumes$.value.catalogResumes;
            this.rowsCount = this.catalogResumes$.value.total;
        });
    };

    /**
     * Функция ищет резюме по поисковому запросу.
     * @param searchText - Поисковая строка.
     * @returns - Список резюме после поиска.
     */
   public async onSearchResumesAsync(event: any) {
    (await this._resumeService.searchResumesAsync(event.query))
    .subscribe(_ => {
        console.log("Результаты поиска: ", this.catalogResumes$.value);
        this.aResumesCatalog = this.catalogResumes$.value.catalogResumes;
    });
   };

    public async onLoadCatalogResumesAsync() {
        await this.loadCatalogResumesAsync();
    };

    /**
     * Функция пагинации резюме.
     * @param page - Номер страницы.
     * @returns - Список резюме.
     */
     public async onGetResumesPaginationAsync(event: any) {                
        console.log(event);
        (await this._resumeService.getResumesPaginationAsync(event.page))
            .subscribe(_ => {
                console.log("Пагинация: ", this.pagination$.value), "page: " ;
                this.setUrlParams(event.page + 1); // Надо инкрементить, так как event.page по дефолту имеет 0 для 1 элемента.
            });
    };
    
    /**
     * Функция инициализации пагинации.
     */
     private async initResumesPaginationAsync() {                
        (await this._resumeService.getResumesPaginationAsync(0))
            .subscribe(_ => {
                console.log("Пагинация: ", this.pagination$.value), "page: " + this.page;
                this.setUrlParams(1);    
            });
    };

    /**
     * Функция переходит к анкете, который выбрали.
     * @param profileInfoId - Id анкеты.
     * @param userCode - Код пользователя.
     */
     public async onRouteSelectedResume(profileInfoId: number, userCode: string) {
        localStorage["p_i_i"] = profileInfoId; // Записываем в кэш Id выбранной анкеты в базе резюме.

        this._router.navigate(["/profile/aboutme"], {
            queryParams: {
                mode: "view",
                uc: userCode
            }
        });
    };
}