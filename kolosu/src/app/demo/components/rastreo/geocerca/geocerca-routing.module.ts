
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GeocercaComponent } from './geocerca.component';

const routes: Routes = [
  { path: '', component: GeocercaComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GeocercaComponentRoutingModule { }
