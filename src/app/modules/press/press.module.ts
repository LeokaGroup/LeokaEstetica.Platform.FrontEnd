import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { PanelMenuModule } from 'primeng/panelmenu';
import { EditorModule } from 'primeng/editor';
import { MenuModule } from 'primeng/menu';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputMaskModule } from 'primeng/inputmask';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { HttpClientModule } from '@angular/common/http';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { SplitterModule } from 'primeng/splitter';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { PaginatorModule } from 'primeng/paginator';
import { RadioButtonModule } from 'primeng/radiobutton';
import { TagModule } from 'primeng/tag';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { CardModule } from 'primeng/card';
import { PressRoutingModule } from './press-routing.module';
import { ContactComponent } from './contact/contact.component';
import { PressService } from './services/press.service';
import { PublicOfferComponent } from './public-offer/public-offer.component';

@NgModule({
    declarations: [
        ContactComponent,
        PublicOfferComponent
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
        PressRoutingModule,
        DropdownModule,
        TableModule,
        ButtonModule,
        DialogModule,
        SplitterModule,
        OverlayPanelModule,
        AutoCompleteModule,
        PaginatorModule,    
        RadioButtonModule,
        TagModule,
        MessagesModule,
        MessageModule,
        CardModule
    ],

    exports: [],

    providers: [
        PressService
    ]
})

export class PressModule { }