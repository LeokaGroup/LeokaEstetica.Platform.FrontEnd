import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AboutmeComponent} from './aboutme/components/aboutme.component';
import {CreateProjectComponent} from './project/create-project/components/create-project.component';
import {MyProjectsComponent} from './project/my-projects/components/my-projects.component';
import {SubscriptionsComponent} from './subscriptions/components/subscriptions.component';
import {MyVacancyComponent} from "./my-vacancy/my-vacancy.component";
import {OrdersComponent} from './orders/orders-list/components/orders.component';
import {OrderDetailsComponent} from './orders/order-details/components/order-details.component';
import {ProjectsArchiveComponent} from './project/archive/components/archive.component';
import {VacanciesArchiveComponent} from './vacancy/archive/components/archive.component';
import {RestoreComponent} from './restore/components/restore.component';
import {MessagesComponent} from './messages/messages.component';
import {MySpaceComponent} from "./my-space/my-space.component";

const routes: Routes = [
  {
    path: 'aboutme', component: AboutmeComponent
  },

  {
    path: 'projects/my', component: MyProjectsComponent
  },

  {
    path: 'projects/create', component: CreateProjectComponent
  },

  {
    path: 'subscriptions', component: SubscriptionsComponent
  },

  {
    path: 'vacancies/my', component: MyVacancyComponent
  },

  {
    path: 'orders', component: OrdersComponent
  },

  {
    path: 'orders/details', component: OrderDetailsComponent
  },

  {
    path: 'projects/archive', component: ProjectsArchiveComponent
  },

  {
    path: 'vacancies/archive', component: VacanciesArchiveComponent
  },

  {
    path: 'restore', component: RestoreComponent
  },

  {
    path: 'messages', component: MessagesComponent
  },

  {
    path: 'space/my', component: MySpaceComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class BackOfficeRoutingModule {
}
