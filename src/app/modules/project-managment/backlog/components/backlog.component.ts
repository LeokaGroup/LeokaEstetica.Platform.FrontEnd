import {Component, OnInit} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { forkJoin } from "rxjs";
import { RedirectService } from "src/app/common/services/redirect.service";
import { ProjectManagmentService } from "../../services/project-managment.service";

@Component({
  selector: "",
  templateUrl: "./backlog.component.html",
  styleUrls: ["./backlog.component.scss"]
})

/**
 * Класс компонента управления проектами (бэклог).
 */
export class BacklogComponent implements OnInit {
  constructor(private readonly _projectManagmentService: ProjectManagmentService,
              private readonly _router: Router,
              private readonly _redirectService: RedirectService,
              private readonly _activatedRoute: ActivatedRoute) {
  }

  // public readonly headerItems$ = this._projectManagmentService.headerItems$;

  selectedProjectId: number = 0;

  public async ngOnInit() {
    forkJoin([
      this.checkUrlParams()
    ]).subscribe();
  };

  private async checkUrlParams() {
    this._activatedRoute.queryParams
      .subscribe(async params => {
        this.selectedProjectId = params["projectId"];
      });
  };

  public onSelectPanelMenu() {
    console.log("onSelectPanelMenu");
    this._projectManagmentService.isLeftPanel = true;
  };
}
