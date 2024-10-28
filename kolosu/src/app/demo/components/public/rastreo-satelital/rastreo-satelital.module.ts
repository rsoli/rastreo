import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RastreoSatelitalRoutingModule } from './rastreo-satelital-routing.module';
import { RastreoSatelitalComponent } from '../rastreo-satelital/rastreo-satelital.component';
import { PrimengModule } from '../../../../shared/primeng/primeng.module';

@NgModule({
  declarations: [
    RastreoSatelitalComponent
  ],
  imports: [
    CommonModule,
    RastreoSatelitalRoutingModule,
    PrimengModule
  ]
})
export class RastreoSatelitalModule { }
