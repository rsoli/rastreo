import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InicioRoutingModule } from './inicio-routing.module';
import { InicioComponent } from '../inicio/inicio.component';
import { PrimengModule } from '../../../../shared/primeng/primeng.module';

@NgModule({
  declarations: [
    InicioComponent
  ],
  imports: [
    CommonModule,
    InicioRoutingModule,
    PrimengModule
  ]
})
export class InicioModule { }
