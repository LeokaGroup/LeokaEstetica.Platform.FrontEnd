import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SpaceComponent } from './start/components/space/space.component';
import { StartProjectManagmentComponent } from './start/components/start/start-project-managment.component';

const routes: Routes = [
    // {
    //     path: '', component: CatalogProjectsComponent
    // },

    {
        path: 'start', component: StartProjectManagmentComponent
    },

    {
        path: 'space', component: SpaceComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class ProjectManagmentRoutingModule { }
