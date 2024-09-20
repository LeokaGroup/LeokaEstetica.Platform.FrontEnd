import {Component, OnInit} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import {ProjectManagmentService} from "../../../project-managment/services/project-managment.service";
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';

@Component({
  selector: "calendar-employee",
  templateUrl: "./calendar-employee.component.html",
  styleUrls: ["./calendar-employee.component.scss"]
})

/**
 * Класс компонента календаря сотрудника и не только.
 */
export class CalendarEmployeeComponent implements OnInit {
  constructor(private readonly _projectManagmentService: ProjectManagmentService,
              private readonly _router: Router,
              private readonly _activatedRoute: ActivatedRoute) {
  }

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin]
  };

  public async ngOnInit() {
    this.checkUrlParams();
  };

  private async checkUrlParams() {
    this._activatedRoute.queryParams
      .subscribe(async params => {

      });
  };
}
