import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientePagoComponent } from './cliente-pago.component';
import { ClientePagoRoutingModule } from './cliente-pago-routing.module';
import { SharedModule } from 'src/app/shared/shared/shared.module';

@NgModule({
  declarations: [ClientePagoComponent],
  imports: [
    CommonModule,
    ClientePagoRoutingModule,
    SharedModule
  ]
})
export class ClientePagoModule { }
