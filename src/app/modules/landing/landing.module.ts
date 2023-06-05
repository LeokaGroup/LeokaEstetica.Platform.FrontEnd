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
import { AccordionModule } from 'primeng/accordion';
import { CarouselModule } from 'primeng/carousel';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { SplitterModule } from 'primeng/splitter';
import { ScrollTopModule } from 'primeng/scrolltop';


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
        TimelineModule,
        AccordionModule,
        CarouselModule,
        ScrollPanelModule,
        SplitterModule,
        ScrollTopModule
    ],

    exports: [],

    providers: [

    ]
})

export class LandingModule {
}