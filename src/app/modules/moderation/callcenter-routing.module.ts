import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CallCenterComponent } from './components/callcenter/callcenter.component';

const routes: Routes = [
    {
        path: 'callcenter', component: CallCenterComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class CallCenterRoutingModule { }
