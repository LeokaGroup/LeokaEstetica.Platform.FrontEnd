import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VacancyRoutingModule } from './vacancy-routing.module';
import {ConfirmationService, MessageService} from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { UserService } from '../../user/services/user.service';
import { CatalogVacancyComponent } from './catalog/components/catalog-vacancy.component';
import { CreateVacancyComponent } from './create/create.component';
import { PanelMenuModule } from 'primeng/panelmenu';
import { EditorModule } from 'primeng/editor';
import { MenuModule } from 'primeng/menu';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputMaskModule } from 'primeng/inputmask';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { HttpClientModule } from '@angular/common/http';
import { DetailVacancyComponent } from './detail/detail.component';
import { DropdownModule } from 'primeng/dropdown';
import { RadioButtonModule } from 'primeng/radiobutton';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { PaginatorModule } from 'primeng/paginator';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ListboxModule } from 'primeng/listbox';
import { TableModule } from "primeng/table";
import { MessagesModule } from 'primeng/messages';
import { VacanciesArchiveComponent } from './archive/components/archive.component';
import { MessageModule } from 'primeng/message';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@NgModule({
    declarations: [
        CatalogVacancyComponent,
        CreateVacancyComponent,
        DetailVacancyComponent,
        VacanciesArchiveComponent
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
    VacancyRoutingModule,
    DropdownModule,
    RadioButtonModule,
    AutoCompleteModule,
    PaginatorModule,
    TagModule,
    ButtonModule,
    DialogModule,
    ListboxModule,
    TableModule,
    MessagesModule,
    MessageModule,
    ConfirmDialogModule
  ],

    exports: [],

    providers: [
        UserService,
        MessageService,
        ConfirmationService
    ]
})

export class VacancyModule { }
