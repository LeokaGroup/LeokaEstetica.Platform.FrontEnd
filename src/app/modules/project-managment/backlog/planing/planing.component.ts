import {Component, OnInit, Sanitizer} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { forkJoin } from "rxjs";
import { RedirectService } from "src/app/common/services/redirect.service";
import { ProjectManagmentService } from "../../services/project-managment.service";
import {DomSanitizer} from "@angular/platform-browser";

@Component({
  selector: "",
  templateUrl: "./planing.component.html",
  styleUrls: ["./planing.component.scss"]
})

/**
 * Класс компонента спринтов (планирование спринта).
 */
export class PlaningSprintComponent implements OnInit {
  constructor(private readonly _projectManagmentService: ProjectManagmentService,
              private readonly _router: Router,
              private readonly _redirectService: RedirectService,
              private readonly _activatedRoute: ActivatedRoute,
              private readonly _domSanitizer: DomSanitizer,
              private readonly _sanitizer: Sanitizer) {
  }

  // public readonly backlogData$ = this._projectManagmentService.backlogData$;

  selectedProjectId: number = 0;
  isLoading: boolean = false;

  public async ngOnInit() {
    this._projectManagmentService.isLeftPanel = false;

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
