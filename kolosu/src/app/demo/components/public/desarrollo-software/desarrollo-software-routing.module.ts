import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DesarrolloSoftwareComponent } from '../desarrollo-software/desarrollo-software.component';

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forChild([
		{ path: '', component: DesarrolloSoftwareComponent }
	])],
  
  exports: [RouterModule]
})
export class DesarrolloSoftwareRoutingModule { }
