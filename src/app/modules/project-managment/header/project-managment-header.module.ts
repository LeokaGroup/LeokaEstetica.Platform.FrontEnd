import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
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
import { ProjectManagmentHeaderRoutingModule } from './project-managment-header-routing.module';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { AvatarModule } from 'primeng/avatar';
import { MenubarModule } from 'primeng/menubar';
import { TooltipModule } from 'primeng/tooltip';
import { ListboxModule } from 'primeng/listbox';
import { DragDropModule } from 'primeng/dragdrop';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ProjectManagementHeaderComponent } from './components/project-management-header.component';

@NgModule({
    declarations: [
        ProjectManagementHeaderComponent
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
        ProjectManagmentHeaderRoutingModule,
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
        CardModule,
        ScrollPanelModule,
        AvatarModule,
        MenubarModule,
        TooltipModule,
        ListboxModule,
        DragDropModule,
        BreadcrumbModule
    ],

    exports: [],

    providers: [
        MessageService
    ]
})

export class ProjectManagmentHeaderModule { }
