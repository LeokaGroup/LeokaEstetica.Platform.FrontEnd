import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { UserService } from '../user/services/user.service';
import { PanelMenuModule } from 'primeng/panelmenu';
import { EditorModule } from 'primeng/editor';
import { MenuModule } from 'primeng/menu';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputMaskModule } from 'primeng/inputmask';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { HttpClientModule } from '@angular/common/http';
import { SignalrService } from '../notifications/signalr/services/signalr.service';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import {TabViewModule} from 'primeng/tabview';
import { MegaMenuModule } from 'primeng/megamenu';
import { SidebarModule } from 'primeng/sidebar';
import { OrderFormRoutingModule } from './order-form-routing.module';
import { StepsModule } from 'primeng/steps';
import { OrderFormInfoComponent } from './order-form-info/components/order-form-info.component';
import { OrderFormStepsComponent } from './order-form-steps/order-form-steps.component';
import { OrderFormSelectSubscriptionPlanComponent } from './select-subscription-plan/select-subscription-plan.component';
import { SliderModule } from 'primeng/slider';
import { OrderFormProductsComponent } from './products/products.component';
import { PayComponent } from './pay/pay.component';
import { InputNumberModule } from 'primeng/inputnumber';
import { RadioButtonModule } from 'primeng/radiobutton';

@NgModule({
    declarations: [
        OrderFormInfoComponent,
        OrderFormStepsComponent,
        OrderFormSelectSubscriptionPlanComponent,
        OrderFormProductsComponent,
        PayComponent
    ],

    imports: [
        CommonModule,
        FormsModule,
        HttpClientModule,
        PanelModule,
        MenuModule,
        InputTextModule,
        CheckboxModule,
        InputMaskModule,
        InputTextareaModule,
        PanelMenuModule,
        ToastModule,
        EditorModule,
        DropdownModule,
        TableModule,
        ButtonModule,
        DialogModule,
        OrderFormRoutingModule,
        TabViewModule,
        ReactiveFormsModule,
        MegaMenuModule,
        SidebarModule,
        StepsModule,
        SliderModule,
        InputNumberModule,
        RadioButtonModule
    ],

    exports: [],

    providers: [
        UserService,
        MessageService,
        SignalrService
    ]
})

export class OrderFormModule { }
