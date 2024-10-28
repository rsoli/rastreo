import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MonitoreoComponent } from '../monitoreo/monitoreo.component';

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forChild([
		{ path: '', component: MonitoreoComponent }
	])],
  
  exports: [RouterModule]
})
export class MonitoreoRoutingModule { }
