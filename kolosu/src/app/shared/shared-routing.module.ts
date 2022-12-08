import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { InicioComponent } from './inicio/inicio.component';

const routes: Routes = [
  { 
    path: 'inicio', 
    component: InicioComponent },
  {
    path: '**',
    redirectTo: '/shared/inicio',
    pathMatch: 'full'
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SharedRoutingModule { }
