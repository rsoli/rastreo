import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ParametrosRoutingModule } from './parametros-routing.module';
import { ListaDepartamentoComponent } from './departamento/lista-departamento/lista-departamento.component';
import { ModalDepartamentoComponent } from './departamento/modal-departamento/modal-departamento.component';

@NgModule({
  declarations: [
    ListaDepartamentoComponent,
    ModalDepartamentoComponent
  ],
  imports: [
    CommonModule,
    ParametrosRoutingModule
  ]
})
export class ParametrosModule { }
