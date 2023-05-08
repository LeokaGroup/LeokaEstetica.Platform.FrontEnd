import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrderFormInfoComponent } from './order-form-info/components/order-form-info.component';

const routes: Routes = [
    {
        path: 'info', component: OrderFormInfoComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class OrderFormRoutingModule { }
