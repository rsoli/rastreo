import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SobreNosotrosComponent } from '../sobre-nosotros/sobre-nosotros.component';


const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forChild([
		{ path: '', component: SobreNosotrosComponent }
	])],
  
  exports: [RouterModule]
})
export class SobreNosotrosRoutingModule { }
