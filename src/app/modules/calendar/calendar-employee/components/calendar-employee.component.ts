import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import ruLocale from '@fullcalendar/core/locales/ru';
import {EventInput} from "@fullcalendar/core";
import {ProjectManagementHumanResourcesService} from "../../services/project-management-human-resources.service";
import {CalendarInput} from "../../models/input/calendar-input";
import {ConfirmationService} from "primeng/api";
import {UntypedFormControl, UntypedFormGroup, Validators} from "@angular/forms";

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
              private readonly _activatedRoute: ActivatedRoute,
              private _confirmationService: ConfirmationService) {
  }

  eventsPromise?: Promise<EventInput[]>;
  public readonly calendarEvents$ = this._projectManagementHumanResourcesService.calendarEvents$;
  public readonly eventUsers$ = this._projectManagementHumanResourcesService.eventUsers$;
  public readonly busyVariants$ = this._projectManagementHumanResourcesService.busyVariants$;
  public readonly eventDetails$ = this._projectManagementHumanResourcesService.eventDetails$;

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
  isEditEvent: boolean = false;
  isNeedUserActionEvent: boolean = false;
  selectedEventId: number = 0;
  oEvent: any;
  isDetailsEvent: boolean = false;
  detailEventName: string = "";
  detailEventDescription: string = "";
  detailDatesRange: any;
  aDetailsEventMembers: any[] = [];
  detailSelectedEventMember: any;
  detailEventLocation: string = "";
  detailMemberStatus: string = "";
  detailsBusy: string = "";

  formBusy: UntypedFormGroup = new UntypedFormGroup({
    "selectedBusyVariant": new UntypedFormControl("", [
      Validators.required
    ])
  });

  public async ngOnInit() {
    this.checkUrlParams();
    await this.getCalendarEventsAsync();
  };

  /**
   * Функция выбора даты календаря.
   * @param event - Ивент.
   */
  private onSelectDate(event: any) {
    console.log("handleDateClick", event);
    this.isNeedUserActionEvent = true;
    this.selectedEventId = event.event._def.extendedProps.eventId;
  };

  /**
   * Функция выбора события календаря.
   * @param event - Ивент.
   */
  private onSelectEvent(event: any) {
    console.log("handleEventClick", event);
    this.isNeedUserActionEvent = true;
    this.selectedEventId = event.event._def.extendedProps.eventId;
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
    const index = this.aEventMembers.findIndex((x: any) => x.userId === event.value.userId);
    if (index === -1) {
      this.aEventMembers = [...this.aEventMembers, event.value];
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

  /**
   * Функция создает событие в календаре.
   */
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

  /**
   * Функция открывает модалку просмотра/изменения события календаря.
   */
  public async onGetEventDetailsAsync() {
    await this.getBusyVariantsAsync();

    (await this._projectManagementHumanResourcesService.getEventDetailsAsync(this.selectedEventId))
      .subscribe(_ => {
        console.log("Детали события календаря: ", this.eventDetails$.value);

        this.isNeedUserActionEvent = false;
        this.isDetailsEvent = true;
        this.detailEventName = this.eventDetails$.value.title;
        this.detailEventDescription = this.eventDetails$.value.eventDescription;
        this.detailDatesRange = [new Date(this.eventDetails$.value.start), new Date(this.eventDetails$.value.end)];
        this.aDetailsEventMembers = this.eventDetails$.value.eventMembers;
        this.detailEventLocation = this.eventDetails$.value.eventLocation;
        this.detailsBusy = this.eventDetails$.value.displayEventMemberStatus;

        let value = this.busyVariants$.value.find((ed: any) => ed.description == this.detailsBusy);
        this.formBusy.get("selectedBusyVariant")?.setValue(value);
      });
  };

  /**
   * Функция обновляет данные события.
   */
  public async onUpdateEventAsync() {
    let calendarInput = new CalendarInput();
    calendarInput.eventName = this.detailEventName;

    if (this.detailEventDescription != null
      && this.detailEventDescription != ""
      && this.detailEventDescription != undefined) {
      calendarInput.eventDescription = this.detailEventDescription;
    }

    calendarInput.eventMembers = this.aEventMembers;

    if (this.eventLocation != null
      && this.eventLocation != ""
      && this.eventLocation != undefined) {
      calendarInput.eventLocation = this.eventLocation;
    }

    calendarInput.eventStartDate = this.detailDatesRange[0];
    calendarInput.eventEndDate = this.detailDatesRange[1];
    calendarInput.eventId = this.selectedEventId;
    calendarInput.eventMembers = this.aDetailsEventMembers;
    calendarInput.calendarEventMemberStatus = this.formBusy.get("selectedBusyVariant")?.value.sysName;

    (await this._projectManagementHumanResourcesService.updateEventAsync(calendarInput))
      .subscribe(async(_: any) => {
        this.isDetailsEvent = false;
        await this.getCalendarEventsAsync();
      });
  };

  /**
   * Функция удаляет событие.
   */
  public async onDeleteEventAsync() {
    (await this._projectManagementHumanResourcesService.removeEventAsync(this.selectedEventId))
      .subscribe(async(_: any) => {
        this.isNeedUserActionEvent = false;
        await this.getCalendarEventsAsync();
      });
  };
}
