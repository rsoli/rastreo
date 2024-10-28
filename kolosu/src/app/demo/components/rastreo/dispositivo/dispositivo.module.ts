
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DispositivoComponent } from './dispositivo.component';
import { DispositivoComponentRoutingModule } from './dispositivo-routing.module';
import { SharedModule } from 'src/app/shared/shared/shared.module';

@NgModule({
  declarations: [DispositivoComponent],
  imports: [
    CommonModule,
    DispositivoComponentRoutingModule,
    SharedModule
  ]
})
export class DispositivoComponentModule { }
