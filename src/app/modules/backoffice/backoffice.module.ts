import {DEFAULT_CURRENCY_CODE, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {BackOfficeRoutingModule} from './backoffice-routing.module';
import {AboutmeComponent} from './aboutme/components/aboutme.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {PanelModule} from 'primeng/panel';
import {MenuModule} from 'primeng/menu';
import {InputTextModule} from 'primeng/inputtext';
import {CheckboxModule} from 'primeng/checkbox';
import {InputMaskModule} from 'primeng/inputmask';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {PickListModule} from 'primeng/picklist';
import {LoadingScriptService} from 'src/app/common/services/loading-scripts.service';
import {RedisService} from '../redis/services/redis.service';
import {PanelMenuModule} from 'primeng/panelmenu';
import {ToastModule} from 'primeng/toast';
import {MessageService} from 'primeng/api';
import {TableModule} from 'primeng/table';
import {MyProjectsComponent} from './project/my-projects/components/my-projects.component';
import {CreateProjectComponent} from './project/create-project/components/create-project.component';
import {EditorModule} from 'primeng/editor';
import {ButtonModule} from 'primeng/button';
import {DropdownModule} from 'primeng/dropdown';
import {SubscriptionsComponent} from './subscriptions/components/subscriptions.component';
import {CardModule} from 'primeng/card';
import {DialogModule} from 'primeng/dialog';
import {MyVacancyComponent} from "./my-vacancy/my-vacancy.component";
import {RedirectService} from 'src/app/common/services/redirect.service';
import {MessagesModule} from 'primeng/messages';
import {OrdersComponent} from './orders/orders-list/components/orders.component';
import {OrderDetailsComponent} from './orders/order-details/components/order-details.component';
import {ProjectsArchiveComponent} from './project/archive/components/archive.component';
import {RestoreComponent} from './restore/components/restore.component';
import {MessageModule} from 'primeng/message';
import {MessagesComponent} from './messages/messages.component';
import {SplitterModule} from 'primeng/splitter';
import {InputNumberModule} from 'primeng/inputnumber';
import {InputSwitchModule} from 'primeng/inputswitch';
import {PhoneFormatPipe} from './aboutme/pipes/phone-format.pipe';
import {TieredMenuModule} from 'primeng/tieredmenu';
import {TooltipModule} from 'primeng/tooltip';
import {MySpaceComponent} from "./my-space/my-space.component";
import { DataViewModule } from 'primeng/dataview';

@NgModule({
  declarations: [
    AboutmeComponent,
    MyProjectsComponent,
    CreateProjectComponent,
    SubscriptionsComponent,
    MyVacancyComponent,
    OrdersComponent,
    OrderDetailsComponent,
    ProjectsArchiveComponent,
    RestoreComponent,
    MessagesComponent,
    PhoneFormatPipe,
    MySpaceComponent
  ],

  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
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
    DropdownModule,
    CardModule,
    DialogModule,
    MessagesModule,
    MessageModule,
    SplitterModule,
    InputNumberModule,
    InputSwitchModule,
    TieredMenuModule,
    TooltipModule,
    DataViewModule
  ],

  exports: [],

  providers: [
    LoadingScriptService,
    RedisService,
    MessageService,
    RedirectService,
    {
      provide: DEFAULT_CURRENCY_CODE,
      useValue: 'RUB'
    }
  ]
})

export class BackOfficeModule {
}
