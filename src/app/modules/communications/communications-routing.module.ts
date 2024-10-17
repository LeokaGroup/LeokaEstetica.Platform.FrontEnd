import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ChatCommunicationsComponent} from "./chat-communications/chat-communications.component";

const routes: Routes = [
  {
    path: '', component: ChatCommunicationsComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class CommunicationsRoutingModule { }
