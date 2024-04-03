import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { forkJoin } from "rxjs";
import { ProjectManagmentService } from "../../../services/project-managment.service";

@Component({
  selector: "",
  templateUrl: "./epic-details.component.html",
  styleUrls: ["./epic-details.component.scss"]
})

/**
 * Класс модуля управления проектами (детали эпика).
 */
export class EpicDetailsComponent implements OnInit {
  constructor(private readonly _projectManagmentService: ProjectManagmentService,
              private readonly _router: Router,
              private readonly _activatedRoute: ActivatedRoute) {
  }

  // public readonly taskDetails$ = this._projectManagmentService.taskDetails$;

  projectId: any;
  epicId: any;

  public async ngOnInit() {
    forkJoin([
      this.checkUrlParams()
    ]).subscribe();
  };

  private async checkUrlParams() {
    this._activatedRoute.queryParams
      .subscribe(async params => {
        console.log("params: ", params);

        this.projectId = params["projectId"];
        this.epicId = params["epicId"];
      });
  };
}
