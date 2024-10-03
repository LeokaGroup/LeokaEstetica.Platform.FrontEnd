import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ToastModule} from 'primeng/toast';
import {UserService} from '../user/services/user.service';
import {PanelMenuModule} from 'primeng/panelmenu';
import {EditorModule} from 'primeng/editor';
import {MenuModule} from 'primeng/menu';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {InputMaskModule} from 'primeng/inputmask';
import {CheckboxModule} from 'primeng/checkbox';
import {InputTextModule} from 'primeng/inputtext';
import {PanelModule} from 'primeng/panel';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {DropdownModule} from 'primeng/dropdown';
import {TableModule} from 'primeng/table';
import {ButtonModule} from 'primeng/button';
import {DialogModule} from 'primeng/dialog';
import {SplitterModule} from 'primeng/splitter';
import {OverlayPanelModule} from 'primeng/overlaypanel';
import {AutoCompleteModule} from 'primeng/autocomplete';
import {PaginatorModule} from 'primeng/paginator';
import {RadioButtonModule} from 'primeng/radiobutton';
import {TagModule} from 'primeng/tag';
import {MessagesModule} from 'primeng/messages';
import {MessageModule} from 'primeng/message';
import {CardModule} from 'primeng/card';
import {ProjectManagmentRoutingModule} from './project-managment-routing.module';
import {ScrollPanelModule} from 'primeng/scrollpanel';
import {StartProjectManagmentComponent} from './start/components/start/start-project-managment.component';
import {SpaceComponent} from './start/components/space/space.component';
import {AvatarModule} from 'primeng/avatar';
import {MenubarModule} from 'primeng/menubar';
import {TooltipModule} from 'primeng/tooltip';
import {ListboxModule} from 'primeng/listbox';
import {DragDropModule} from 'primeng/dragdrop';
import {TaskDetailsComponent} from './task/components/task-details/task-details.component';
import {BreadcrumbModule} from 'primeng/breadcrumb';
import {CreateTaskComponent} from './task/components/create-task/create-task.component';
import {InplaceModule} from 'primeng/inplace';
import {ChipModule} from 'primeng/chip';
import {SettingsProjectManagmentComponent} from './settings/components/settings.component';
import {SplitButtonModule} from 'primeng/splitbutton';
import {FileUploadModule} from 'primeng/fileupload';
import {TabViewModule} from 'primeng/tabview';
import {ProjectSettingsComponent} from './project-settings/components/project-settings.component';
import {ImageModule} from 'primeng/image';
import {SidebarModule} from 'primeng/sidebar';
import {BacklogComponent} from './backlog/components/backlog.component';
import {LeftPanelComponent} from "./left-panel/left-panel.component";
import {CalendarModule} from 'primeng/calendar';
import {TranslateLoader, TranslateModule, TranslateService, TranslateStore } from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import { PlaningSprintComponent } from './backlog/planing/planing.component';
import { EpicDetailsComponent } from './task/components/epic/epic-details.component';
import { SprintComponent } from './sprint/components/sprint.component';
import {SprintDetailsComponent} from "./sprint-details/components/sprint-details.component";
import { InputSwitchModule } from 'primeng/inputswitch';
import { WorkSpaceComponent } from './workspace/components/workspace.component';
import { DataViewModule } from 'primeng/dataview';
import { ScrumMasterAiAssistComponent } from './scrum-master-ai/components/scrum-master-ai-assist.component';
import { WikiComponent } from './wiki/components/wiki.component';
import { TreeModule } from 'primeng/tree';
import { ContextMenuModule } from 'primeng/contextmenu';
import { MessageService } from 'primeng/api';
import {AccessService} from "../access/access.service";

@NgModule({
  declarations: [
    StartProjectManagmentComponent,
    SpaceComponent,
    TaskDetailsComponent,
    CreateTaskComponent,
    SettingsProjectManagmentComponent,
    ProjectSettingsComponent,
    BacklogComponent,
    LeftPanelComponent,
    PlaningSprintComponent,
    EpicDetailsComponent,
    SprintComponent,
    SprintDetailsComponent,
    WorkSpaceComponent,
    ScrumMasterAiAssistComponent,
    WikiComponent
  ],

  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
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
    ProjectManagmentRoutingModule,
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
    BreadcrumbModule,
    InplaceModule,
    ChipModule,
    SplitButtonModule,
    FileUploadModule,
    TabViewModule,
    ImageModule,
    SidebarModule,
    CalendarModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    }),
    InputSwitchModule,
    DataViewModule,
    TreeModule,
    ContextMenuModule
  ],

  exports: [],

  providers: [
    UserService,
    MessageService,
    TranslateService,
    TranslateStore,
    AccessService
  ]
})

export class ProjectManagmentModule {}

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
