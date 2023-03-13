import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LandingComponent } from './components/landing.component';
import { LandingRoutingModule } from './landing-routing.module';
import { FareRuleComponent } from '../fare-rule/components/fare-rule.component';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { TagModule } from 'primeng/tag';
import { TimelineModule } from 'primeng/timeline';


@NgModule({
    declarations: [
        LandingComponent,
        FareRuleComponent
    ],

    imports: [
        CommonModule,
        FormsModule,
        LandingRoutingModule,
        CardModule,
        DividerModule,
        TagModule,
        TimelineModule
    ],

    exports: [],

    providers: [

    ]
})

export class LandingModule {
}