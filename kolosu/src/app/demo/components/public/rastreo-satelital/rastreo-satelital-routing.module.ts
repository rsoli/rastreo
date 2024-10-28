import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RastreoSatelitalComponent } from '../rastreo-satelital/rastreo-satelital.component';

const routes: Routes = [];

@NgModule({

  imports: [RouterModule.forChild([
		{ path: '', component: RastreoSatelitalComponent }
	])],
  
  exports: [RouterModule]
})
export class RastreoSatelitalRoutingModule { }
