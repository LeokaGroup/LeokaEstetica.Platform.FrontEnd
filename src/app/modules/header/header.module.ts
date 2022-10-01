import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from './components/header.component';
import { HeaderRoutingModule } from './header-routing.module';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
    declarations: [
        HeaderComponent
    ],

    imports: [
        CommonModule,
        FormsModule,
        HeaderRoutingModule,
        HttpClientModule
    ],

    exports: [],

    providers: [
        
    ]
})

export class HeaderModule {
}