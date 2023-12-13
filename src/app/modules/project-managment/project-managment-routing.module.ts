import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SpaceComponent } from './start/components/space/space.component';
import { StartProjectManagmentComponent } from './start/components/start/start-project-managment.component';
import { CreateTaskComponent } from './task/components/create-task/create-task.component';
import { TaskDetailsComponent } from './task/components/task-details/task-details.component';

const routes: Routes = [
    // {
    //     path: '', component: ProjectManagementHeaderComponent
    // },

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
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class ProjectManagmentRoutingModule { }
