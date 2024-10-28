import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClienteServicioComponent } from './cliente-servicio.component';
import { ClienteServicioRoutingModule } from './cliente-servicio-routing.module';
import { SharedModule } from 'src/app/shared/shared/shared.module';

@NgModule({
  declarations: [ClienteServicioComponent],
  imports: [
    CommonModule,
    ClienteServicioRoutingModule,
    SharedModule
  ]
})
export class ClienteServicioModule { }
