import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EstadisticasComponent } from '../estadisticas/estadisticas.component';

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forChild([
		{ path: '', component: EstadisticasComponent }
	])],
  exports: [RouterModule]
})
export class EstadisticasRoutingModule { }
