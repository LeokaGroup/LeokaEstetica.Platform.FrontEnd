import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { PayRoutingModule } from './pay-routing.module';
import { PayComponent } from './components/pay.component';
import { CheckboxModule } from 'primeng/checkbox';

@NgModule({
    declarations: [
        PayComponent
    ],

    imports: [
        CommonModule,
        FormsModule,
        PayRoutingModule,
        ReactiveFormsModule,
        ToastModule,
        CheckboxModule
    ],

    exports: [],

    providers: [
        MessageService
    ]
})

export class PayModule {}