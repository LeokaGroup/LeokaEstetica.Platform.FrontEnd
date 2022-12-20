import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ModerationComponent } from './components/moderation.component';

const routes: Routes = [
    {
        path: 'moderation', component: ModerationComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class ModerationRoutingModule { }
