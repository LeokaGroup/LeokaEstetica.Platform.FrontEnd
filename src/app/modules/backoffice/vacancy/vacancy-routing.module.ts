import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CatalogVacancyComponent } from './catalog/components/catalog-vacancy.component';
import { CreateVacancyComponent } from './create/create.component';
import { DetailVacancyComponent } from './detail/detail.component';

const routes: Routes = [
    {
        path: '', component: CatalogVacancyComponent
    },

    {
        path: 'create', component: CreateVacancyComponent
    },
    {
        path: 'vacancy', component: DetailVacancyComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class VacancyRoutingModule { }
