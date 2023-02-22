import { Component, OnInit } from "@angular/core";
import { forkJoin } from "rxjs";

@Component({
    selector: "administration",
    templateUrl: "./administration.component.html",
    styleUrls: ["./administration.component.scss"]
})

/**
 * Класс компонента администрации.
 */
export class AdministrationComponent implements OnInit {
    // public readonly profileSkillsItems$ = this._backofficeService.profileSkillsItems$;   

    constructor() {

    }

    public async ngOnInit() {
        forkJoin([
            
        ]).subscribe();    
    };

    /**
    * Функция получает список навыков пользователя для выбора.
    * @returns - Список навыков.
    */
    // private async getProfileSkillsAsync() {
    //     (await this._backofficeService.getProfileSkillsAsync())
    //         .subscribe(_ => {
    //             console.log("Список навыков для выбора: ", this.profileSkillsItems$.value);
    //         });
    // };

    public onSelectTabAsync(e: any) {

    };
}