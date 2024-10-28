import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChoferComponent } from './chofer.component';

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forChild([
		{ path: '', component: ChoferComponent }
	])],

  exports: [RouterModule]
})
export class ChoferRoutingModule { }
