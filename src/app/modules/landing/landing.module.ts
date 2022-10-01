import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LandingComponent } from './components/landing.component';
import { LandingRoutingModule } from './landing-routing.module';

@NgModule({
    declarations: [
        LandingComponent
    ],

    imports: [
        CommonModule,
        FormsModule,
        LandingRoutingModule
    ],

    exports: [],

    providers: [
        
    ]
})

export class LandingModule {
}