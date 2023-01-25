import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { UserService } from '../user/services/user.service';
import { PanelMenuModule } from 'primeng/panelmenu';
import { EditorModule } from 'primeng/editor';
import { MenuModule } from 'primeng/menu';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputMaskModule } from 'primeng/inputmask';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { HttpClientModule } from '@angular/common/http';
import { SignalrService } from '../notifications/signalr/services/signalr.service';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ModerationRoutingModule } from './moderation-routing.module';
import { SignInComponent } from './components/signin/signin.component';
import { ModerationComponent } from './components/moderation/moderation.component';
import {TabViewModule} from 'primeng/tabview';

@NgModule({
    declarations: [
        SignInComponent,
        ModerationComponent
    ],

    imports: [
        CommonModule,
        FormsModule,
        HttpClientModule,
        PanelModule,
        MenuModule,
        InputTextModule,
        CheckboxModule,
        InputMaskModule,
        InputTextareaModule,
        PanelMenuModule,
        ToastModule,
        EditorModule,
        DropdownModule,
        TableModule,
        ButtonModule,
        DialogModule,
        ModerationRoutingModule,
        TabViewModule,
        ReactiveFormsModule
    ],

    exports: [],

    providers: [
        UserService,
        MessageService,
        SignalrService
    ]
})

export class ModerationModule { }