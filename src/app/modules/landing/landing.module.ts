import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LandingComponent } from './components/landing.component';
import { LandingRoutingModule } from './landing-routing.module';
import { FareRuleComponent } from '../fare-rule/components/fare-rule.component';
import { CardModule } from 'primeng/card';

@NgModule({
    declarations: [
        LandingComponent,
        FareRuleComponent
    ],

    imports: [
        CommonModule,
        FormsModule,
        LandingRoutingModule,
        CardModule
    ],

    exports: [],

    providers: [

    ]
})

export class LandingModule {
}