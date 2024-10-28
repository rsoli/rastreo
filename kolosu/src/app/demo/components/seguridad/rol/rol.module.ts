
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RolComponent } from './rol.component';
import { RolComponentRoutingModule } from './rol-routing.module';
import { SharedModule } from 'src/app/shared/shared/shared.module';

@NgModule({
  declarations: [RolComponent],
  imports: [
    CommonModule,
    RolComponentRoutingModule,
    SharedModule
  ]
})
export class RolComponentModule { }
