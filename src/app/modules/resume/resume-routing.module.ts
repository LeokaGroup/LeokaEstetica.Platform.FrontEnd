import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CatalogResumeComponent } from './catalog/components/catalog.component';

const routes: Routes = [
    {
        path: '', component: CatalogResumeComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class ResumeRoutingModule { }
