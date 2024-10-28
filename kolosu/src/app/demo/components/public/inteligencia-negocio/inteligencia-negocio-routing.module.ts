import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InteligenciaNegocioComponent } from '../inteligencia-negocio/inteligencia-negocio.component';

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forChild([
		{ path: '', component: InteligenciaNegocioComponent }
	])],
  
  exports: [RouterModule]
})
export class InteligenciaNegocioRoutingModule { }
