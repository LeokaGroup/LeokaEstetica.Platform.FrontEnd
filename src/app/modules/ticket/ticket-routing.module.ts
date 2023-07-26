import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TicketComponent } from './components/landing/ticket.component';
import { ProfileTicketComponent } from './components/profile/profile-ticket.component';
import { ViewTicketComponent } from './components/view/view-ticket.component';

const routes: Routes = [
    {
        path: '', component: TicketComponent
    },

    {
        path: 'tickets', component: ProfileTicketComponent
    },

    {
        path: 'ticket', component: ViewTicketComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class TicketRoutingModule { }
