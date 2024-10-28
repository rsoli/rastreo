import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContactoRoutingModule } from './contacto-routing.module';
import { ContactoComponent } from '../contacto/contacto.component';
import { PrimengModule } from '../../../../shared/primeng/primeng.module';


@NgModule({
  declarations: [
    ContactoComponent
  ],
  imports: [
    CommonModule,
    ContactoRoutingModule,
    PrimengModule
  ]
})
export class ContactoModule { }
