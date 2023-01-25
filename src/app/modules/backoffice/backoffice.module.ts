import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { BackOfficeRoutingModule } from './backoffice-routing.module';
import { AboutmeComponent } from './aboutme/components/aboutme.component';
import { FormsModule } from '@angular/forms';
import { PanelModule } from 'primeng/panel';
import { MenuModule } from 'primeng/menu';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { PickListModule } from 'primeng/picklist';
import { SignalrService } from '../notifications/signalr/services/signalr.service';
import { LoadingScriptService } from 'src/app/common/services/loading-scripts.service';
import { RedisService } from '../redis/services/redis.service';
import { PanelMenuModule } from 'primeng/panelmenu';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import {TableModule} from 'primeng/table';
import { MyProjectsComponent } from './project/my-projects/components/my-projects.component';
import { CreateProjectComponent } from './project/create-project/components/create-project.component';
import {EditorModule} from 'primeng/editor';
import { ButtonModule } from 'primeng/button';
import {DropdownModule} from 'primeng/dropdown';


@NgModule({
    declarations: [
        AboutmeComponent,
        MyProjectsComponent,
        CreateProjectComponent
    ],

    imports: [
        CommonModule,
        FormsModule,
        BackOfficeRoutingModule,
        HttpClientModule,
        PanelModule,
        MenuModule,
        InputTextModule,
        CheckboxModule,
        InputMaskModule,
        InputTextareaModule,
        PickListModule,
        PanelMenuModule,
        ToastModule,
        TableModule,
        EditorModule,
        ButtonModule,
        DropdownModule
    ],

    exports: [],

    providers: [
        LoadingScriptService,
        SignalrService,
        RedisService,
        MessageService
    ]
})

export class BackOfficeModule { }