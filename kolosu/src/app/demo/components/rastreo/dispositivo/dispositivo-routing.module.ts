
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DispositivoComponent } from './dispositivo.component';

const routes: Routes = [
  { path: '', component: DispositivoComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DispositivoComponentRoutingModule { }
