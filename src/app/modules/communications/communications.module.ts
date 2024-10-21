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
import { SplitterModule } from 'primeng/splitter';
import {NgFor} from "@angular/common";
import { TabMenuModule } from 'primeng/tabmenu';

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
    ButtonModule,
    SplitterModule,
    NgFor,
    TabMenuModule
  ],

  providers: [

  ]
})

export class CommunicationsModule { }
