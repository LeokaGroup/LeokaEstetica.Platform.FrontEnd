import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TicketComponent } from './components/landing/ticket.component';
import { ProfileTicketComponent } from './components/profile/profile-ticket.component';

const routes: Routes = [
    {
        path: '', component: TicketComponent
    },

    {
        path: 'tickets', component: ProfileTicketComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class TicketRoutingModule { }
