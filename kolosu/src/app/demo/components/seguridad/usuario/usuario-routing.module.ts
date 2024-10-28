import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsuarioComponent } from '../usuario/usuario.component';

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forChild([
		{ path: '', component: UsuarioComponent }
	])],
  
  exports: [RouterModule]
})
export class UsuarioRoutingModule { }
