import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ForbiddenComponent } from './modules/forbidden/forbidden.component';
import {FareRuleComponent} from "./modules/fare-rule/components/fare-rule.component";

const routes: Routes = [
  {
    path: "",
    loadChildren: () => import('./modules/landing/landing.module').then(m => m.LandingModule)
  },

  {
    path: "user",
    loadChildren: () => import('./modules/user/user.module').then(m => m.UserModule)
  },

  {
    path: "profile",
    loadChildren: () => import('./modules/backoffice/backoffice.module').then(m => m.BackOfficeModule)
  },

  {
    path: "vacancies",
    loadChildren: () => import('./modules/backoffice/vacancy/vacancy.module').then(m => m.VacancyModule)
  },

  {
    path: "projects",
    loadChildren: () => import('./modules/project/project.module').then(m => m.ProjectModule)
  },

  {
    path: "resumes",
    loadChildren: () => import('./modules/resume/resume.module').then(m => m.ResumeModule)
  },

  {
    path: "notifications",
    loadChildren: () => import('./modules/backoffice/notification/notification.module').then(m => m.NotificationsModule)
  },

  {
    path: "order-form",
    loadChildren: () => import('./modules/order-form/order-form.module').then(m => m.OrderFormModule)
  },

  {
    path: "profile",
    loadChildren: () => import('./modules/ticket/ticket.module').then(m => m.TicketModule)
  },

  {
    path: 'forbidden', component: ForbiddenComponent
  },

  {
    path: "press",
    loadChildren: () => import('./modules/press/press.module').then(m => m.PressModule)
  },

  {
    path: "project-management",
    loadChildren: () => import('./modules/project-managment/project-managment.module').then(m => m.ProjectManagmentModule)
  },

  {
    path: 'fare-rules', component: FareRuleComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
