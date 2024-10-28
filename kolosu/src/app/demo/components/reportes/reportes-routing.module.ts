import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forChild([
    { path: 'estadisticas', loadChildren: () => import('./estadisticas/estadisticas.module').then(m => m.EstadisticasModule) },
    { path: 'eventos', loadChildren: () => import('./eventos/eventos.module').then(m => m.EventosModule) },
    { path: 'rutas', loadChildren: () => import('./rutas/rutas.module').then(m => m.RutasModule) },
    { path: '**', redirectTo: '/notfound' }
])], 
  exports: [RouterModule]
})
export class ReportesRoutingModule { }
