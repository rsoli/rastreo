import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MonitoreoRoutingModule } from './monitoreo-routing.module';
import { MonitoreoComponent } from '../monitoreo/monitoreo.component';
import { SharedModule } from 'src/app/shared/shared/shared.module';

import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    MonitoreoComponent
  ],
  imports: [
    CommonModule,
    MonitoreoRoutingModule,
    SharedModule,

    FormsModule
  ]
})
export class MonitoreoModule { }
