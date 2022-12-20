import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ModerationComponent } from './components/moderation/moderation.component';
import { SignInComponent } from './components/signin/signin.component';

const routes: Routes = [
    {
        path: 'moderation', component: ModerationComponent
    },

    {
        path: 'moderation/signin', component: SignInComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class ModerationRoutingModule { }
