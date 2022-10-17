import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { BackOfficeRoutingModule } from './backoffice-routing.module';
import { AboutmeComponent } from './aboutme/components/aboutme.component';
import { FormsModule } from '@angular/forms';

@NgModule({
    declarations: [
        AboutmeComponent
    ],

    imports: [
        CommonModule,
        FormsModule,
        BackOfficeRoutingModule,
        HttpClientModule                
    ],

    exports: [],

    providers: [

    ]
})

export class BackOfficeModule { }