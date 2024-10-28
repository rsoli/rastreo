
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeocercaComponent } from './geocerca.component';
import { GeocercaComponentRoutingModule } from './geocerca-routing.module';
import { SharedModule } from 'src/app/shared/shared/shared.module';

@NgModule({
  declarations: [GeocercaComponent],
  imports: [
    CommonModule,
    GeocercaComponentRoutingModule,
    SharedModule
  ]
})
export class GeocercaComponentModule { }
