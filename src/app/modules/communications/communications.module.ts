import {HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import { SlideMenuModule } from 'primeng/slidemenu';
import { PanelMenuModule } from 'primeng/panelmenu';
import { MenuModule } from 'primeng/menu';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import {ChatCommunicationsComponent} from "./chat-communications/chat-communications.component";
import {CommunicationsRoutingModule} from "./communications-routing.module";

@NgModule({
  declarations: [
    ChatCommunicationsComponent
  ],

  imports: [
    CommunicationsRoutingModule,
    HttpClientModule,
    SlideMenuModule,
    PanelMenuModule,
    MenuModule,
    BreadcrumbModule,
    FormsModule,
    ButtonModule
  ],

  providers: [

  ]
})

export class CommunicationsModule { }
