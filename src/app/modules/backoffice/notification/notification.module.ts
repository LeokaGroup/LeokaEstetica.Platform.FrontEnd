import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NotificationsRoutingModule } from './notification-routing.module';
import { FormsModule } from '@angular/forms';
import { PanelModule } from 'primeng/panel';
import { MenuModule } from 'primeng/menu';
import { LoadingScriptService } from 'src/app/common/services/loading-scripts.service';
import { PanelMenuModule } from 'primeng/panelmenu';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';


@NgModule({
    declarations: [
       
    ],

    imports: [
        CommonModule,
        FormsModule,
        NotificationsRoutingModule,
        HttpClientModule,
        PanelModule,
        MenuModule,
        PanelMenuModule,
        ButtonModule,
        CardModule,
        DialogModule
    ],

    exports: [],

    providers: [
        LoadingScriptService,
        MessageService
    ]
})

export class NotificationsModule { }