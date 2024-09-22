import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import ruLocale from '@fullcalendar/core/locales/ru';
import {EventInput} from "@fullcalendar/core";
import {ProjectManagementHumanResourcesService} from "../../services/project-management-human-resources.service";

@Component({
  selector: "calendar-employee",
  templateUrl: "./calendar-employee.component.html",
  styleUrls: ["./calendar-employee.component.scss"]
})

/**
 * Класс компонента календаря сотрудника и не только.
 */
export class CalendarEmployeeComponent implements OnInit {
  constructor(private readonly _projectManagementHumanResourcesService: ProjectManagementHumanResourcesService,
              private readonly _router: Router,
              private readonly _activatedRoute: ActivatedRoute) {
  }

  eventsPromise?: Promise<EventInput[]>;
  public readonly calendarEvents$ = this._projectManagementHumanResourcesService.calendarEvents$;

  // Настройки календаря.
  calendarOptions: any = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, interactionPlugin],
    dateClick: (arg: any) => this.onDateClick(arg),
    eventClick: (arg: any) => this.onEventClick(arg),
    locale: ruLocale
  };

  public async ngOnInit() {
    this.checkUrlParams();
    await this.getCalendarEventsAsync();
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

  /**
   * Функция получает события календаря текущего пользователя.
   */
  private async getCalendarEventsAsync() {
    (await this._projectManagementHumanResourcesService.getCalendarEventsAsync())
      .subscribe(_ => {
        console.log("События календаря:", this.calendarEvents$.value);
        this.calendarOptions.events = this.calendarEvents$.value;
      });
  };
}
