import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './modules/header/components/header.component';
import { HeaderService } from './modules/header/services/header.service';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent
  ],

  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule    
  ],

  providers: [
    HeaderService
  ],

  bootstrap: [AppComponent]
})

export class AppModule { }
