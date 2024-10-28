import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [];

@NgModule({ 
  imports: [RouterModule.forChild([
    { path: 'lista_geocerca', loadChildren: () => import('./geocerca/geocerca.module').then(m => m.GeocercaComponentModule) },
    { path: 'monitoreo_vehiculo', loadChildren: () => import('./monitoreo/monitoreo.module').then(m => m.MonitoreoModule) },
    { path: 'lista_chofer', loadChildren: () => import('./chofer/chofer.module').then(m => m.ChoferModule) },
    { path: 'lista_cliente', loadChildren: () => import('./cliente/cliente.module').then(m => m.ClienteModule) },
    { path: 'lista_cliente_vehiculo/:id_cliente', loadChildren: () => import('./vehiculo/vehiculo.module').then(m => m.VehiculoComponentModule) },
    { path: 'lista_cliente_servicio/:id_cliente', loadChildren: () => import('./cliente-servicio/cliente-servicio.module').then(m => m.ClienteServicioModule) },
    { path: 'lista_cliente_pago/:id_cliente', loadChildren: () => import('./cliente-pago/cliente-pago.module').then(m => m.ClientePagoModule) },
    { path: 'lista_vehiculo', loadChildren: () => import('./dispositivo/dispositivo.module').then(m => m.DispositivoComponentModule) },
    { path: 'monitoreo_google', loadChildren: () => import('./monitoreo/monitoreo.module').then(m => m.MonitoreoModule) },
    { path: '**', redirectTo: '/auth/login' },
    // { path: '**', redirectTo: '/notfound' }
    
])], 

  exports: [RouterModule]
})
export class RastreoRoutingModule { }
