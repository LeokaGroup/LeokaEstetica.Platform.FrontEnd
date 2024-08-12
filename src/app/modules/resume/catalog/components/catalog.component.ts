import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { forkJoin } from "rxjs";
import { ResumeService } from "../services/resume.service";

@Component({
    selector: "",
    templateUrl: "./catalog.component.html",
    styleUrls: ["./catalog.component.scss"]
})

/**
 * Класс компонента анкет пользователей.
 */
export class CatalogResumeComponent implements OnInit {
    constructor(private readonly _router: Router,
        private readonly _resumeService: ResumeService,
        private readonly _activatedRoute: ActivatedRoute) {
    }

    public readonly catalogResumes$ = this._resumeService.catalogResumes$;
    public readonly pagination$ = this._resumeService.pagination$;
    public readonly access$ = this._resumeService.access$;

    aResumesCatalog: any[] = [];
    searchText: string = "";
    page: number = 0;
    rowsCount: number = 0;
    availableText: any[] = [
      {
        severity: "warn" ,
        summary: "Для доступа к базе резюме Вам нужно приобрести один из платных тарифов \"Стартовый\", \"Основной\" или \"Комплексный\".",
      }
    ];
    isAvailable: boolean = false;

    public async ngOnInit() {
        forkJoin([
           this.checkUrlParams(),
           await this.checkAvailableAccessResumesAsync()
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
        this.rowsCount = this.catalogResumes$.value.total;
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

      let lastId;

      // Получаем для бэка последнюю запись из выборки, чтобы он отсекал записи.
      if (this.aResumesCatalog.length > 0) {
        lastId = this.aResumesCatalog[this.aResumesCatalog.length - 1].profileInfoId;
      }

      // Если = 1, значит получают первую страницу.
      if (lastId == 1) {
        lastId = null;
      }

      (await this._resumeService.getResumesPaginationAsync(event.page, lastId))
        .subscribe(_ => {
          console.log("Пагинация: ", this.pagination$.value), "page: ";
          this.aResumesCatalog = this.pagination$.value.resumes;
          this.rowsCount = this.pagination$.value.total;
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
          this.aResumesCatalog = this.pagination$.value.resumes;
          this.rowsCount = this.pagination$.value.total;
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

     /**
     * Функция проверяет доступ к базе резюме.
     * @returns - Доступ.
     */
     private async checkAvailableAccessResumesAsync() {
        (await this._resumeService.checkAvailableAccessResumesAsync())
            .subscribe(async (response: any) => {
                console.log("Доступ: ", this.access$.value);
                this.isAvailable = response.access > 2;

                // Доступ к базе резюме даем.
                if (this.isAvailable) {
                    await this.loadCatalogResumesAsync();
                    await this.initResumesPaginationAsync();
                }
            });
    };
}
