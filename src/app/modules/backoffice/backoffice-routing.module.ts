import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutmeComponent } from './aboutme/components/aboutme.component';
import { MyProjectsComponent } from './project/my-projects/components/my-projects.component';

const routes: Routes = [
    {
        path: 'aboutme', component: AboutmeComponent
    },

    {
        path: 'projects/my', component: MyProjectsComponent
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class BackOfficeRoutingModule { }
