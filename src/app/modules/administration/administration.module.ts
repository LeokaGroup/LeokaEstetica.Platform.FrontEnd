import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PanelModule } from 'primeng/panel';
import { MenuModule } from 'primeng/menu';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { LoadingScriptService } from 'src/app/common/services/loading-scripts.service';
import { PanelMenuModule } from 'primeng/panelmenu';
import { ToastModule } from 'primeng/toast';
import {TableModule} from 'primeng/table';
import {EditorModule} from 'primeng/editor';
import { ButtonModule } from 'primeng/button';
import {DropdownModule} from 'primeng/dropdown';
import { TabViewModule } from 'primeng/tabview';
import { AdministrationRoutingModule } from './administration-routing.module';
import { AdministrationComponent } from './components/administration.component';


@NgModule({
    declarations: [
        AdministrationComponent
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
        TabViewModule,
        ReactiveFormsModule,
        AdministrationRoutingModule
    ],

    exports: [],

    providers: [
        LoadingScriptService
    ]
})

export class AdministrationModule { }