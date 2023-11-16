import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StartProjectManagmentComponent } from './start/components/start-project-managment.component';

const routes: Routes = [
    // {
    //     path: '', component: CatalogProjectsComponent
    // },

    {
        path: 'start', component: StartProjectManagmentComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class ProjectManagmentRoutingModule { }
