import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MonitoreoVehiculoComponent } from './monitoreo/monitoreo-vehiculo/monitoreo-vehiculo.component';
import { RecorridoComponent } from './reportes/recorrido/recorrido.component';
import { ParqueoComponent } from './reportes/parqueo/parqueo.component';
import { ListaClienteComponent } from './servicio/cliente/lista-cliente/lista-cliente.component';
import { ListaVehiculoComponent } from './servicio/vehiculo/lista-vehiculo/lista-vehiculo.component';
import { GeocercaComponent } from './monitoreo/geocerca/geocerca.component';
import { FormularioGeocercaComponent } from './monitoreo/formulario-geocerca/formulario-geocerca.component';
import { VehiculoComponent } from './monitoreo/vehiculo/vehiculo.component';
import { PagoClienteComponent } from './servicio/pago/pago-cliente/pago-cliente.component';
import { ListaServicioComponent } from './servicio/cliente/lista-servicio/lista-servicio.component';
import { MonitoreoGoogleComponent } from './monitoreo/monitoreo-google/monitoreo-google.component';
import { ListaChoferComponent } from './monitoreo/chofer/lista-chofer/lista-chofer.component';
import { ListaEntregaComponent } from './monitoreo/entrega/lista-entrega/lista-entrega.component';
import { ListaZonaComponent } from './monitoreo/zona/lista-zona/lista-zona.component';
import { FormularioZonaComponent } from './monitoreo/zona/formulario-zona/formulario-zona.component';
import { ListaZonaGrupoComponent } from './monitoreo/zona/lista-zona-grupo/lista-zona-grupo.component';

import { ListaZonaGrupoDetalleComponent } from './monitoreo/zona/lista-zona-grupo-detalle/lista-zona-grupo-detalle.component';
// import { FormularioZonaGrupoDetalleComponent } from './monitoreo/zona/formulario-zona-grupo-detalle/formulario-zona-grupo-detalle.component';



const routes: Routes = [
  {
    path: 'monitoreo_vehiculo',
    component: MonitoreoVehiculoComponent
  },
  {
    path: 'reporte_recorrido',
    component: RecorridoComponent
  },
  {
    path: 'reporte_parqueos',
    component: ParqueoComponent
  },
  {
    path: 'lista_cliente',
    component: ListaClienteComponent
  },
  {
    path: 'lista_vehiculo/:id',
    component: ListaVehiculoComponent
  },
  {
    path: 'lista_geocerca',
    component: GeocercaComponent
  },
  {
    path: 'formulario_geocerca',
    component: FormularioGeocercaComponent
  },
  {
    path: 'lista_vehiculo',
    component: VehiculoComponent
  },
  {
    path: 'pagos_cliente/:id',
    component: PagoClienteComponent
  },
  {
    path: 'lista_servicio/:id',
    component: ListaServicioComponent
  },
  {
    path: 'monitoreo_google',
    component: MonitoreoGoogleComponent
  },
  {
    path: 'lista_chofer',
    component: ListaChoferComponent
  },
  {
    path: 'lista_zona',
    component: ListaZonaComponent
  },
  {
    path: 'lista_entrega',
    component: ListaEntregaComponent
  },
  {
    path: 'formulario_zona',
    component: FormularioZonaComponent
  },
  {
    path: 'lista_zona_grupo',
    component: ListaZonaGrupoComponent
  },
  {
    path: 'lista_zona_grupo_detalle/:id',
    component: ListaZonaGrupoDetalleComponent
  },
  {
    path: '**',
    redirectTo: '/shared/slider',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RastreoRoutingModule { }
