import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InteligenciaNegocioRoutingModule } from './inteligencia-negocio-routing.module';
import { InteligenciaNegocioComponent } from '../inteligencia-negocio/inteligencia-negocio.component';
import { PrimengModule } from '../../../../shared/primeng/primeng.module';

@NgModule({
  declarations: [
    InteligenciaNegocioComponent
  ],
  imports: [
    CommonModule,
    InteligenciaNegocioRoutingModule,
    PrimengModule
  ]
})
export class InteligenciaNegocioModule { }
