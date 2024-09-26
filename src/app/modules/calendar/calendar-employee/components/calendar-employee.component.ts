import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import ruLocale from '@fullcalendar/core/locales/ru';
import {EventInput} from "@fullcalendar/core";
import {ProjectManagementHumanResourcesService} from "../../services/project-management-human-resources.service";
import {CalendarInput} from "../../models/input/calendar-input";

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
  public readonly eventUsers$ = this._projectManagementHumanResourcesService.eventUsers$;
  public readonly busyVariants$ = this._projectManagementHumanResourcesService.busyVariants$;

  // Настройки календаря.
  calendarOptions: any = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, interactionPlugin],
    dateClick: (event: any) => this.onSelectDate(event),
    eventClick: (event: any) => this.onSelectEvent(event),
    locale: ruLocale,
    customButtons: {
      createEventCustomButton: {
        text: 'Создать событие',
        click: async () => {
          this.isCreateEvent = true;
          await this.getBusyVariantsAsync();
        }
      }
    },
    headerToolbar: {
      left: 'title',
      center: '',
      right: 'createEventCustomButton,prev,next'
    }
  };
  isCreateEvent: boolean = false;
  eventName: string = "";
  eventDescription?: string;
  eventRageDates: any;
  hourFormat: number = 24;
  isShowTime: boolean = true;
  time: Date[] | undefined;
  searchEventMember: any;
  aEventMembers: any[] = [];
  selectedEventMember: any;
  eventLocation?: string;
  selectedBusy: any;

  public async ngOnInit() {
    this.checkUrlParams();
    await this.getCalendarEventsAsync();
  };

  private onSelectDate(event: any) {
    console.log("handleDateClick", event);
  };

  private onSelectEvent(event: any) {
    console.log("handleEventClick", event);
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

  /**
   * Функция поиска пользователя.
   * @param event - Ивент.
   */
  public async onSearchEventMemberAsync(event: any) {
    (await this._projectManagementHumanResourcesService.searchEventMemberAsync(event.query))
      .subscribe(_ => {
        console.log("Поиск: ", this.eventUsers$.value);
      });
  };

  /**
   * Функция выбирает участников события и пишет в массив.
   * @param event - Ивент.
   */
  public onSelectEventMember(event: any) {
    if (this.aEventMembers.indexOf((x: any) => x.userId !== event.value.userId) == -1) {
      this.aEventMembers.push(event.value);
    }
  };

  /**
   * Функция получает типы занятости.
   */
  private async getBusyVariantsAsync() {
    (await this._projectManagementHumanResourcesService.getBusyVariantsAsync())
      .subscribe(_ => {
        console.log("Типы занятости: ", this.busyVariants$.value);
      });
  };

  public async onCreateCalendarEventAsync() {
    let calendarInput = new CalendarInput();
    calendarInput.eventName = this.eventName;

    if (this.eventDescription != null
      && this.eventDescription != ""
      && this.eventDescription != undefined) {
      calendarInput.eventDescription = this.eventDescription;
    }

    calendarInput.eventMembers = this.aEventMembers;

    if (this.eventLocation != null
      && this.eventLocation != ""
      && this.eventLocation != undefined) {
      calendarInput.eventLocation = this.eventLocation;
    }

    calendarInput.eventStartDate =this.eventRageDates[0];
    calendarInput.eventEndDate =this.eventRageDates[1];
    calendarInput.calendarEventMemberStatus = this.selectedBusy.sysName;

    (await this._projectManagementHumanResourcesService.createEventAsync(calendarInput))
      .subscribe(async(_: any) => {
        this.isCreateEvent = false;
        await this.getCalendarEventsAsync();
      });
  };
}
