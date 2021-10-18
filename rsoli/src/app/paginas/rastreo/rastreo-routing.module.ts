import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MonitoreoVehiculoComponent } from './monitoreo/monitoreo-vehiculo/monitoreo-vehiculo.component';

const routes: Routes = [
  {
    path: 'monitoreo_vehiculo',
    component: MonitoreoVehiculoComponent
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
