import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RutasRoutingModule } from './rutas-routing.module';
import { RutasComponent } from '../rutas/rutas.component';


@NgModule({
  declarations: [
    RutasComponent
  ],
  imports: [
    CommonModule,
    RutasRoutingModule
  ]
})
export class RutasModule { }
