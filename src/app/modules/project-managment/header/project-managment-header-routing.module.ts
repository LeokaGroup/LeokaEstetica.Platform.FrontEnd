import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectManagementHeaderComponent } from './components/project-management-header.component';

const routes: Routes = [
    {
        path: '', component: ProjectManagementHeaderComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class ProjectManagmentHeaderRoutingModule { }
