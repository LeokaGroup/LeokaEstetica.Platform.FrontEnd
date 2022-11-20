import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CatalogProjectsComponent } from './catalog/components/catalog.component';

const routes: Routes = [
    {
        path: 'catalog', component: CatalogProjectsComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class ProjectRoutingModule { }
