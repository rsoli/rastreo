import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RastreoRoutingModule } from './rastreo-routing.module';
import { MonitoreoVehiculoComponent } from './monitoreo/monitoreo-vehiculo/monitoreo-vehiculo.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { PrimengModule } from '../../componentes/primeng/primeng/primeng.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    MonitoreoVehiculoComponent
  ],
  imports: [
    CommonModule,
    RastreoRoutingModule,
    LeafletModule,
    PrimengModule,
    FormsModule
  ]
})
export class RastreoModule { }
