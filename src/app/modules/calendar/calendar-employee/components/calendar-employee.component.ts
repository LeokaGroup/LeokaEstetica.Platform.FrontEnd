import {Component, OnInit} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import {ProjectManagmentService} from "../../../project-managment/services/project-managment.service";
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import ruLocale from '@fullcalendar/core/locales/ru';

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

  calendarOptions: any = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, interactionPlugin],
    dateClick: (arg: any) => this.handleDateClick(arg),
    events: [
      {title: 'event 1', date: '2019-04-01'},
      {title: 'event 2', date: '2019-04-02'}
    ],
    locale: ruLocale
  };

  public handleDateClick(arg: any) {
    console.log("handleDateClick", arg);
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
