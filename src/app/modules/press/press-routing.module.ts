import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContactComponent } from './contact/contact.component';
import { PublicOfferComponent } from './public-offer/public-offer.component';

const routes: Routes = [
    {
        path: 'contacts', component: ContactComponent
    },

    {
        path: 'offer', component: PublicOfferComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class PressRoutingModule { }
