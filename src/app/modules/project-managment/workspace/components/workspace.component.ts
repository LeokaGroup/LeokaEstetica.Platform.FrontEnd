import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { forkJoin } from "rxjs";
import { ProjectManagmentService } from "../../services/project-managment.service";

@Component({
  selector: "",
  templateUrl: "./workspace.component.html",
  styleUrls: ["./workspace.component.scss"]
})

/**
 * Класс компонента пространств проектов.
 */
export class WorkSpaceComponent implements OnInit {
  constructor(private readonly _projectManagmentService: ProjectManagmentService,
              private readonly _router: Router) {
  }

  public readonly workspaces$ = this._projectManagmentService.workspaces$;
  public readonly projectWorkspaceSettings$ = this._projectManagmentService.projectWorkspaceSettings$;

  aWorkspaces: any[] = [];
  isPaginator: boolean = false;

  public async ngOnInit() {
    // await this.getWorkSpacesAsync();
  };



  // public onClosePanelMenu() {
  //   this._projectManagmentService.isLeftPanel = false;
  // };
  //
  // public onSelectPanelMenu() {
  //   this._projectManagmentService.isLeftPanel = true;
  // };
}
