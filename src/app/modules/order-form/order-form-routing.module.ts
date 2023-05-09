import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrderFormInfoComponent } from './order-form-info/components/order-form-info.component';
import { OrderFormStepsComponent } from './order-form-steps/order-form-steps.component';
import { OrderFormProductsComponent } from './products/products.component';
import { OrderFormSelectSubscriptionPlanComponent } from './select-subscription-plan/select-subscription-plan.component';

const routes: Routes = [
    {
        path: 'info', component: OrderFormInfoComponent
    },

    {
        path: 'subscription-plan', component: OrderFormSelectSubscriptionPlanComponent
    },

    {
        path: '', component: OrderFormStepsComponent
    },

    {
        path: 'products', component: OrderFormProductsComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class OrderFormRoutingModule { }
