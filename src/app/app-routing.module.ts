import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ForbiddenComponent } from './modules/forbidden/forbidden.component';
import {FareRuleComponent} from "./modules/fare-rule/components/fare-rule.component";
import { authGuard } from './core/guards/auth.guard';

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
    loadChildren: () => import('./modules/backoffice/backoffice.module').then(m => m.BackOfficeModule),
    canActivate: [authGuard]
  },

  {
    path: "vacancies",
    loadChildren: () => import('./modules/backoffice/vacancy/vacancy.module').then(m => m.VacancyModule),
    canActivate: [authGuard]
  },

  {
    path: "projects",
    loadChildren: () => import('./modules/project/project.module').then(m => m.ProjectModule),
    canActivate: [authGuard]
  },

  {
    path: "resumes",
    loadChildren: () => import('./modules/resume/resume.module').then(m => m.ResumeModule),
    canActivate: [authGuard]
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
    loadChildren: () => import('./modules/project-managment/project-managment.module').then(m => m.ProjectManagmentModule),
    canActivate: [authGuard]
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
