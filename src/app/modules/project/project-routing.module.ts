import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CatalogProjectsComponent } from './catalog/components/catalog.component';
import { DetailProjectComponent } from './detail/components/detail.component';

const routes: Routes = [
    {
        path: '', component: CatalogProjectsComponent
    },

    {
        path: 'project', component: DetailProjectComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class ProjectRoutingModule { }
