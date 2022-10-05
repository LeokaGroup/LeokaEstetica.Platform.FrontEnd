import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SignUpComponent } from './signup/components/signup.component';
import { UserRoutingModule } from './user-routing.module';

@NgModule({
    declarations: [
        SignUpComponent
    ],

    imports: [
        CommonModule,
        FormsModule,
        UserRoutingModule
    ],

    exports: [],

    providers: [
        
    ]
})

export class UserModule {}