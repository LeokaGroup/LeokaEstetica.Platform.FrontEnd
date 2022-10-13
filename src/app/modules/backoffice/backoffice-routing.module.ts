import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutmeComponent } from './aboutme/components/aboutme.component';

const routes: Routes = [
    {
        path: 'aboutme', component: AboutmeComponent
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class BackOfficeRoutingModule { }
