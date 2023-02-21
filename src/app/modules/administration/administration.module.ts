import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AdministrationRoutingModule } from './administration-routing.module';
import { FormsModule } from '@angular/forms';
import { PanelModule } from 'primeng/panel';
import { MenuModule } from 'primeng/menu';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { PickListModule } from 'primeng/picklist';
import { LoadingScriptService } from 'src/app/common/services/loading-scripts.service';
import { PanelMenuModule } from 'primeng/panelmenu';
import { ToastModule } from 'primeng/toast';
import {TableModule} from 'primeng/table';
import {EditorModule} from 'primeng/editor';
import { ButtonModule } from 'primeng/button';
import {DropdownModule} from 'primeng/dropdown';
import { CardModule } from 'primeng/card';


@NgModule({
    declarations: [
        
    ],

    imports: [
        CommonModule,
        FormsModule,
        AdministrationRoutingModule,
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
        DropdownModule,
        CardModule
    ],

    exports: [],

    providers: [
        LoadingScriptService
    ]
})

export class AdministrationModule { }