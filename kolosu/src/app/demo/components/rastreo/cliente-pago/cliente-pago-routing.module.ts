import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientePagoComponent } from './cliente-pago.component';

const routes: Routes = [
  { path: '', component: ClientePagoComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientePagoRoutingModule { }
