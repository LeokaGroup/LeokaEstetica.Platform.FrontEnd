import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutmeComponent } from './aboutme/components/aboutme.component';
import { ProjectComponent } from './project/project.component';

const routes: Routes = [
    {
        path: 'aboutme', component: AboutmeComponent
    },

    {
        path: 'projects', component: ProjectComponent
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class BackOfficeRoutingModule { }
