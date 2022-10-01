import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from './components/header.component';
import { HeaderRoutingModule } from './header-routing.module';

@NgModule({
    declarations: [
        HeaderComponent
    ],

    imports: [
        CommonModule,
        FormsModule,
        HeaderRoutingModule
    ],

    exports: [],

    providers: [
        
    ]
})

export class HeaderModule {
}