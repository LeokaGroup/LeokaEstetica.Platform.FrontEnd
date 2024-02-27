import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SettingsProjectManagmentComponent} from './settings/components/settings.component';
import {SpaceComponent} from './start/components/space/space.component';
import {StartProjectManagmentComponent} from './start/components/start/start-project-managment.component';
import {CreateTaskComponent} from './task/components/create-task/create-task.component';
import {TaskDetailsComponent} from './task/components/task-details/task-details.component';
import {ProjectSettingsComponent} from "./project-settings/components/project-settings.component";

const routes: Routes = [
  {
    path: 'start', component: StartProjectManagmentComponent
  },

  {
    path: 'space', component: SpaceComponent
  },

  {
    path: 'space/details', component: TaskDetailsComponent
  },

  {
    path: 'space/create', component: CreateTaskComponent
  },

  {
    path: 'space/view-settings', component: SettingsProjectManagmentComponent
  },

  {
    path: 'space/project-settings', component: ProjectSettingsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ProjectManagmentRoutingModule {
}
