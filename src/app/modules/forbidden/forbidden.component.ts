import { Component, OnInit } from "@angular/core";
import { forkJoin } from "rxjs";

@Component({
    selector: "forbidden",
    templateUrl: "./forbidden.component.html",
    styleUrls: ["./forbidden.component.scss"]
})

/**
 * Класс компонента ошибки 403.
 */
export class ForbiddenComponent implements OnInit {    
    public async ngOnInit() {
        forkJoin([
           
        ]).subscribe();
    };
}
