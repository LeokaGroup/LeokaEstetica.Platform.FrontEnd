import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {PanelModule} from 'primeng/panel';
import {MenuModule} from 'primeng/menu';
import {InputTextModule} from 'primeng/inputtext';
import {CheckboxModule} from 'primeng/checkbox';
import {InputMaskModule} from 'primeng/inputmask';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {PanelMenuModule} from 'primeng/panelmenu';
import {ToastModule} from 'primeng/toast';
import {TableModule} from 'primeng/table';
import {EditorModule} from 'primeng/editor';
import {ButtonModule} from 'primeng/button';
import {DropdownModule} from 'primeng/dropdown';
import {CardModule} from 'primeng/card';
import {DialogModule} from 'primeng/dialog';
import {MessagesModule} from 'primeng/messages';
import {MessageModule} from 'primeng/message';
import {CalendarRoutingModule} from "./calendar-routing.module";
import {CalendarEmployeeComponent} from "./calendar-employee/components/calendar-employee.component";
import {TabViewModule} from 'primeng/tabview';
import {FullCalendarModule} from '@fullcalendar/angular';

@NgModule({
  declarations: [
    CalendarEmployeeComponent
  ],

  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    PanelModule,
    MenuModule,
    InputTextModule,
    CheckboxModule,
    InputMaskModule,
    InputTextareaModule,
    PanelMenuModule,
    ToastModule,
    TableModule,
    EditorModule,
    ButtonModule,
    DropdownModule,
    CardModule,
    DialogModule,
    MessagesModule,
    MessageModule,
    CalendarRoutingModule,
    TabViewModule,
    FullCalendarModule
  ],

  exports: [],

  providers: []
})

export class CalendarEmployeeModule {
}
