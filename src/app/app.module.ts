import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxLoadingModule } from 'ngx-loading';
import { SlideMenuModule } from 'primeng/slidemenu';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NetworkInterceptor } from './core/interceptors/network-interceptor';
import { NetworkService } from './core/interceptors/network.service';
import { BackOfficeModule } from './modules/backoffice/backoffice.module';
import { LeftMenuComponent } from './modules/backoffice/left-menu/components/left-menu.component';
import { BackOfficeService } from './modules/backoffice/services/backoffice.service';
import { HeaderComponent } from './modules/header/components/header.component';
import { HeaderService } from './modules/header/services/header.service';
import { LandingService } from './modules/landing/services/landing.service';
import { PanelMenuModule } from 'primeng/panelmenu';
import { ToastModule } from 'primeng/toast';
import { VacancyService } from './modules/backoffice/vacancy/services/vacancy.service';
import { ProjectService } from './modules/project/services/project.service';
import {AvatarModule} from 'primeng/avatar';
import { ChatMessagesService } from './modules/messages/chat/services/chat-messages.service';
import { CallCenterService } from './modules/moderation/services/callcenter.service';
import { SearchProjectService } from './modules/search/services/search-project-service';
import { ResumeService } from './modules/resume/catalog/services/resume.service';
import { FareRuleService } from './modules/fare-rule/services/fare-rule.service';
import { SubscriptionsService } from './modules/backoffice/subscriptions/services/subscriptions.service';
import { MenuModule } from 'primeng/menu';
import { AdministrationModule } from './modules/administration/administration.module';
import { AdministrationService } from './modules/administration/services/administration.service';
import { NotificationsService } from './modules/backoffice/notification/services/notifications.service';
import { FooterComponent } from './modules/footer/components/footer.component';
import { CarouselModule } from 'primeng/carousel';
import { CallCenterModule } from './modules/moderation/callcenter.module';
import { OrderFormModule } from './modules/order-form/order-form.module';
import { OrderFormService } from './modules/order-form/order-form-info/services/order-form.service';
import { OrderService } from './modules/order-form/services/order.service';
import { TicketService } from './modules/ticket/services/ticket.service';
import { ForbiddenComponent } from './modules/forbidden/forbidden.component';
import { ProjectManagmentModule } from './modules/project-managment/project-managment.module';
import { ProjectManagmentService } from './modules/project-managment/services/project-managment.service';
import { ProjectManagementHeaderComponent } from './modules/project-managment/header/components/project-management-header.component';
import { DragDropModule } from 'primeng/dragdrop';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { MenubarModule } from 'primeng/menubar';
import { FormsModule } from '@angular/forms';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import {RedisService} from "./modules/redis/services/redis.service";

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LeftMenuComponent,
    FooterComponent,
    ForbiddenComponent,
    ProjectManagementHeaderComponent
  ],

  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgxLoadingModule.forRoot({
      primaryColour: '#7C3AED',
      secondaryColour: '#7C3AED',
      tertiaryColour: '#7C3AED',
      fullScreenBackdrop: true
    }),
    BackOfficeModule,
    BrowserAnimationsModule,
    SlideMenuModule,
    PanelMenuModule,
    ToastModule,
    AvatarModule,
    CallCenterModule,
    MenuModule,
    AdministrationModule,
    CarouselModule,
    OrderFormModule,
    ProjectManagmentModule,
    DragDropModule,
    BreadcrumbModule,
    MenubarModule,
    FormsModule,
    SidebarModule,
    ButtonModule,
    AutoCompleteModule,
    CheckboxModule,
    DialogModule
  ],

  providers: [
    HeaderService,
    LandingService,
    BackOfficeService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: NetworkInterceptor,
      multi: true
    },
    NetworkService,
    VacancyService,
    ProjectService,
    ChatMessagesService,
    CallCenterService,
    SearchProjectService,
    ResumeService,
    FareRuleService,
    SubscriptionsService,
    AdministrationService,
    NotificationsService,
    OrderFormService,
    OrderService,
    TicketService,
    ProjectManagmentService,
    RedisService
  ],

  bootstrap: [AppComponent]
})

export class AppModule { }
