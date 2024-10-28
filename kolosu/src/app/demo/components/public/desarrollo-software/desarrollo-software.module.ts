import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DesarrolloSoftwareRoutingModule } from './desarrollo-software-routing.module';
import { DesarrolloSoftwareComponent } from '../desarrollo-software/desarrollo-software.component';
import { PrimengModule } from '../../../../shared/primeng/primeng.module';

@NgModule({
  declarations: [
    DesarrolloSoftwareComponent
  ],
  imports: [
    CommonModule,
    DesarrolloSoftwareRoutingModule,
    PrimengModule
  ]
})
export class DesarrolloSoftwareModule { }
