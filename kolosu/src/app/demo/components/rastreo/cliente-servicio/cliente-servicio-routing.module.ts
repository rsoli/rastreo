import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClienteServicioComponent } from './cliente-servicio.component';

const routes: Routes = [
  { path: '', component: ClienteServicioComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClienteServicioRoutingModule { }
