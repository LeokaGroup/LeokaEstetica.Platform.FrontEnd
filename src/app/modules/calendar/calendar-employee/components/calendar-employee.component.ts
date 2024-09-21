import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {ProjectManagmentService} from "../../../project-managment/services/project-managment.service";
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import ruLocale from '@fullcalendar/core/locales/ru';
import {EventInput} from "@fullcalendar/core";

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

  eventsPromise?: Promise<EventInput[]>;

  // Настройки календаря.
  calendarOptions: any = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, interactionPlugin],
    dateClick: (arg: any) => this.onDateClick(arg),
    events: [
      {title: 'Мероприятие 1', date: '2024-09-01'},
      {title: 'Мероприятие 2', date: '2024-09-01'},
      {title: 'Мероприятие 3', date: '2024-09-02'}
    ],
    eventClick: (arg: any) => this.onEventClick(arg),
    locale: ruLocale
  };

  public async ngOnInit() {
    this.checkUrlParams();
  };

  private onDateClick(arg: any) {
    console.log("handleDateClick", arg);
  };

  private onEventClick(arg: any) {
    console.log("handleEventClick", arg);
  };

  private async checkUrlParams() {
    this._activatedRoute.queryParams
      .subscribe(async params => {

      });
  };
}
