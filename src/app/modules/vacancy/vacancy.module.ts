import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VacancyRoutingModule } from './vacancy-routing.module';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ConfirmComponent } from '../user/confirm-account/confirm-account.component';
import { UserService } from '../user/services/user.service';

@NgModule({
    declarations: [
        ConfirmComponent
    ],

    imports: [
        CommonModule,
        FormsModule,
        VacancyRoutingModule,
        ReactiveFormsModule,
        ToastModule
    ],

    exports: [],

    providers: [
        UserService,
        MessageService
    ]
})

export class VacancyModule {}