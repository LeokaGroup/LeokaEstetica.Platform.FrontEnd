import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewTicketComponent } from '../ticket/components/view/view-ticket.component';
import { CallCenterComponent } from './components/callcenter/callcenter.component';

const routes: Routes = [
    {
        path: 'callcenter', component: CallCenterComponent
    },

    {
        path: 'callcenter/tickets/:ticketId', component: ViewTicketComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class CallCenterRoutingModule { }
