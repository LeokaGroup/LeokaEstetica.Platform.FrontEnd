import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
    selector: "footer",
    templateUrl: "./footer.component.html",
    styleUrls: ["./footer.component.scss"]
})

/**
 * Класс компонента футера.
 */
export class FooterComponent implements OnInit {
    public dateLine: string = "";

    constructor(private readonly _router: Router) {
    }

    public async ngOnInit() {
        this.calcDateYear();
    };

    private calcDateYear() {
        let startYear = 2023;
        let now = new Date().getFullYear();

        if (now == startYear) {
            this.dateLine += startYear;
        }

        else {
            this.dateLine += startYear + "-" + now;
        }
    };
}
