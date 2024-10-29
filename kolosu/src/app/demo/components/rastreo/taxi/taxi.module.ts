
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaxiComponent } from './taxi.component';
import { TaxiComponentRoutingModule } from './taxi-routing.module';
import { SharedModule } from 'src/app/shared/shared/shared.module';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [TaxiComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TaxiComponentRoutingModule,
    SharedModule
  ]
})
export class TaxiComponentModule { }
