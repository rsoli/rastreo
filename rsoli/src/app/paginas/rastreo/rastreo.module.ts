import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RastreoRoutingModule } from './rastreo-routing.module';
import { MonitoreoVehiculoComponent } from './monitoreo/monitoreo-vehiculo/monitoreo-vehiculo.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { PrimengModule } from '../../componentes/primeng/primeng/primeng.module';
import { FormsModule } from '@angular/forms';
import { RecorridoComponent } from './reportes/recorrido/recorrido.component';
import { ParqueoComponent } from './reportes/parqueo/parqueo.component';

@NgModule({
  declarations: [
    MonitoreoVehiculoComponent,
    RecorridoComponent,
    ParqueoComponent
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
