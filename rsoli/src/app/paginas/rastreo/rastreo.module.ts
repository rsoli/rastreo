import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RastreoRoutingModule } from './rastreo-routing.module';
import { MonitoreoVehiculoComponent } from './monitoreo/monitoreo-vehiculo/monitoreo-vehiculo.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { PrimengModule } from '../../componentes/primeng/primeng/primeng.module';
import { FormsModule } from '@angular/forms';
import { RecorridoComponent } from './reportes/recorrido/recorrido.component';
import { ParqueoComponent } from './reportes/parqueo/parqueo.component';
import { ListaClienteComponent } from './servicio/cliente/lista-cliente/lista-cliente.component';
import { ModalClienteComponent } from './servicio/cliente/modal-cliente/modal-cliente.component';
import { ModalModule, BsModalService } from 'ngx-bootstrap/modal';  
import { ReactiveFormsModule } from '@angular/forms';
import { ListaVehiculoComponent } from './servicio/vehiculo/lista-vehiculo/lista-vehiculo.component';
import { ModalVehiculoComponent } from './servicio/vehiculo/modal-vehiculo/modal-vehiculo.component';

@NgModule({
  declarations: [
    MonitoreoVehiculoComponent,
    RecorridoComponent,
    ParqueoComponent,
    ListaClienteComponent,
    ModalClienteComponent,
    ListaVehiculoComponent,
    ModalVehiculoComponent
  ],
  imports: [
    CommonModule,
    RastreoRoutingModule,
    LeafletModule,
    PrimengModule,
    FormsModule,
    ModalModule.forRoot(),
    ReactiveFormsModule
  ],
  providers: [BsModalService],
})
export class RastreoModule { }
