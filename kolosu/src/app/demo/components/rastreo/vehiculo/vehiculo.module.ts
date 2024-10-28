
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VehiculoComponent } from './vehiculo.component';
import { VehiculoComponentRoutingModule } from './vehiculo-routing.module';
import { SharedModule } from 'src/app/shared/shared/shared.module';

@NgModule({
  declarations: [VehiculoComponent],
  imports: [
    CommonModule,
    VehiculoComponentRoutingModule,
    SharedModule
  ]
})
export class VehiculoComponentModule { }
