import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CatalogVacancyComponent } from './catalog/components/catalog-vacancy.component';
import { CreateVacancyComponent } from './create/create.component';

const routes: Routes = [
    {
        path: 'catalog', component: CatalogVacancyComponent
    },

    {
        path: 'create', component: CreateVacancyComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class VacancyRoutingModule { }
