import { Component, OnInit } from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {BackOfficeService} from "../services/backoffice.service";
import {ProjectManagmentService} from "../../project-managment/services/project-managment.service";

@Component({
  selector: "my-space",
  templateUrl: "./my-space.component.html",
  styleUrls: ["./my-space.component.scss"]
})

/**
 * Класс компонента пространства пользователя ("Мое пространство").
 */
export class MySpaceComponent implements OnInit {
  constructor(private readonly _backOfficeService: BackOfficeService,
              private readonly _router: Router,
              private readonly _projectManagmentService: ProjectManagmentService,
              private readonly _activatedRoute: ActivatedRoute) {
  }

  public async ngOnInit() {

  };
}
