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
import { GeocercaComponent } from './monitoreo/geocerca/geocerca.component';

//import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { LeafletDrawModule } from '@asymmetrik/ngx-leaflet-draw';
import { ModalGeocercaComponent } from './monitoreo/modal-geocerca/modal-geocerca.component';
import { FormularioGeocercaComponent } from './monitoreo/formulario-geocerca/formulario-geocerca.component';
import { VehiculoComponent } from './monitoreo/vehiculo/vehiculo.component';
import { VehiculoGeocercaComponent } from './monitoreo/vehiculo-geocerca/vehiculo-geocerca.component';
import { PagoClienteComponent } from './servicio/pago/pago-cliente/pago-cliente.component';
import { ModalPagoClienteComponent } from './servicio/pago/modal-pago-cliente/modal-pago-cliente.component';
import { ListaServicioComponent } from './servicio/cliente/lista-servicio/lista-servicio.component';
import { ModalServicioComponent } from './servicio/cliente/modal-servicio/modal-servicio.component';
import { MonitoreoGoogleComponent } from './monitoreo/monitoreo-google/monitoreo-google.component';


@NgModule({
  declarations: [
    MonitoreoVehiculoComponent,
    RecorridoComponent,
    ParqueoComponent,
    ListaClienteComponent,
    ModalClienteComponent,
    ListaVehiculoComponent,
    ModalVehiculoComponent,
    GeocercaComponent,
    ModalGeocercaComponent,
    FormularioGeocercaComponent,
    VehiculoComponent,
    VehiculoGeocercaComponent,
    PagoClienteComponent,
    ModalPagoClienteComponent,
    ListaServicioComponent,
    ModalServicioComponent,
    MonitoreoGoogleComponent
  ],
  imports: [
    CommonModule,
    RastreoRoutingModule,
    LeafletModule,
    PrimengModule,
    FormsModule,
    ModalModule.forRoot(),
    ReactiveFormsModule,
    LeafletDrawModule
  ],
  providers: [BsModalService],
})
export class RastreoModule { }
