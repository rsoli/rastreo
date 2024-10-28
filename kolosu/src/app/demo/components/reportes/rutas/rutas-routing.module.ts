import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RutasComponent } from '../rutas/rutas.component';

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forChild([
		{ path: '', component: RutasComponent }
	])],
  exports: [RouterModule]
})
export class RutasRoutingModule { }
