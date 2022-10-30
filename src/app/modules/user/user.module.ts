import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SignUpComponent } from './signup/components/signup.component';
import { UserRoutingModule } from './user-routing.module';
import { UserService } from './services/user.service';
import { ConfirmComponent } from './confirm-account/confirm-account.component';
import { SignInComponent } from './signin/components/signin.component';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@NgModule({
    declarations: [
        SignUpComponent,
        ConfirmComponent,
        SignInComponent
    ],

    imports: [
        CommonModule,
        FormsModule,
        UserRoutingModule,
        ReactiveFormsModule,
        ToastModule
    ],

    exports: [],

    providers: [
        UserService,
        MessageService
    ]
})

export class UserModule {}