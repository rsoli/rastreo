import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
 import { PrimengModule } from '../../../../shared/primeng/primeng.module';


import { ReactiveFormsModule } from '@angular/forms';
//import { LoadingComponent } from '../../../../demo/components/controles/loading/loading.component';
//import { LoadingModule } from '../../../components/controles/loading/loading.module';

@NgModule({
    imports: [
        CommonModule,
        LoginRoutingModule,
        ButtonModule,
        CheckboxModule,
        InputTextModule,
        FormsModule,
        PasswordModule,
         PrimengModule,
        ReactiveFormsModule,
        //LoadingModule
        //LoadingComponent
    ],
    declarations: [LoginComponent]
})
export class LoginModule { }
