import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SobreNosotrosRoutingModule } from './sobre-nosotros-routing.module';
import { SobreNosotrosComponent } from '../sobre-nosotros/sobre-nosotros.component';
import { PrimengModule } from '../../../../shared/primeng/primeng.module';

@NgModule({
  declarations: [
    SobreNosotrosComponent
  ],
  imports: [
    CommonModule,
    SobreNosotrosRoutingModule,
    PrimengModule
  ]
})
export class SobreNosotrosModule { }
