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
import { DropdownModule } from 'primeng/dropdown';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ToastModule } from 'primeng/toast';
import { TicketComponent } from '../ticket/components/landing/ticket.component';
import { WisheOfferComponent } from '../ticket/components/wishe-offer/wishe-offer.component';
import { ButtonModule } from 'primeng/button';


@NgModule({
    declarations: [
        LandingComponent,
        FareRuleComponent,
        TicketComponent,
        WisheOfferComponent
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
        ScrollTopModule,
        DropdownModule,
        InputTextareaModule,
        ToastModule,
        ButtonModule
    ],

    exports: [],

    providers: [

    ]
})

export class LandingModule {
}