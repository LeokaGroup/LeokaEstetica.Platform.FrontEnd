import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {ProjectManagmentService} from "../../services/project-managment.service";

@Component({
  selector: "wiki",
  templateUrl: "./wiki.component.html",
  styleUrls: ["./wiki.component.scss"]
})

/**
 * Класс компонента Wiki модуля УП.
 */
export class WikiComponent implements OnInit {
  constructor(private readonly _router: Router,
              private readonly _activatedRoute: ActivatedRoute,
              private readonly _projectManagmentService: ProjectManagmentService) {
  }

  public readonly wikiTreeItems$ = this._projectManagmentService.wikiTreeItems$;

  projectId: number = 0;
  aTreeItems: any[] = [
    {
      key: '0',
      label: 'Node 0',
      leaf: false
    },
    {
      key: '1',
      label: 'Node 1',
      leaf: false
    },
    {
      key: '2',
      label: 'Node 2',
      leaf: false
    }
  ];

  public async ngOnInit() {
    this.checkUrlParams();
    // await this.getTreeAsync();
  };

  private checkUrlParams() {
    this._activatedRoute.queryParams
      .subscribe(params => {
        if (params["projectId"]) {
          this.projectId = params["projectId"];
        }
      });
  };

  /**
   * Функция получает дерево.
   */
  private async getTreeAsync() {
    (await this._projectManagmentService.getWikiTreeItemsAsync(this.projectId))
      .subscribe(_ => {
        console.log("Дерево: ", this.wikiTreeItems$.value);
        // this.oTreeItems = this.wikiTreeItems$.value[0];
      });
  };

  public onSelect(e: any) {

  }
}
