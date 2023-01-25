import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
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
import { VacancyService } from './modules/vacancy/services/vacancy.service';
import { ProjectService } from './modules/project/services/project.service';
import { AvatarModule } from 'primeng/avatar';
import { ChatMessagesService } from './modules/messages/chat/services/chat-messages.service';
import { ModerationModule } from './modules/moderation/moderation.module';
import { ModerationService } from './modules/moderation/services/moderation.service';
import { SearchProjectService } from './modules/search/services/search-project-service';
import { ResumeService } from './modules/resume/catalog/services/resume.service';
import { FareRuleService } from './modules/fare-rule/services/fare-rule.service';
import { PaymentService } from './modules/pay/services/pay.service';
import { PayModule } from './modules/pay/pay.module';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LeftMenuComponent
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
    ModerationModule,
    PayModule
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
    ModerationService,
    SearchProjectService,
    ResumeService,
    FareRuleService,
    PaymentService
  ],

  bootstrap: [AppComponent]
})

export class AppModule { }
