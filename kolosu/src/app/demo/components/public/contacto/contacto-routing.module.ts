import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContactoComponent } from '../contacto/contacto.component';

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forChild([
		{ path: '', component: ContactoComponent }
	])],
  
  exports: [RouterModule]
})
export class ContactoRoutingModule { }
