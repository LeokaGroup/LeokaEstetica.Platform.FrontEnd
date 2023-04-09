import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CallCenterComponent } from './components/callcenter/callcenter.component';
import { SignInComponent } from './components/signin/signin.component';

const routes: Routes = [
    {
        path: 'callcenter', component: CallCenterComponent
    },

    {
        path: 'callcenter/signin', component: SignInComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class CallCenterRoutingModule { }
