import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {CalendarEmployeeComponent} from "./calendar-employee/components/calendar-employee.component";

const routes: Routes = [
  {
    path: 'employee', component: CalendarEmployeeComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class CalendarRoutingModule { }
