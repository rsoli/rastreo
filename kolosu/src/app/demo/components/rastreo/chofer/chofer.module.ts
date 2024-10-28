import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChoferRoutingModule } from './chofer-routing.module';
import { ChoferComponent } from './chofer.component';

import { SharedModule } from 'src/app/shared/shared/shared.module';

@NgModule({
  declarations: [
    ChoferComponent
  ],
  imports: [
    CommonModule,
    ChoferRoutingModule,
    SharedModule 
  ]
})
export class ChoferModule { }
