import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListaUsuarioComponent } from './usuario/lista-usuario/lista-usuario.component';

export const routes: Routes = [
  {
    path: 'lista_usuario',
    component: ListaUsuarioComponent
  },
  {
      path: '**',
      redirectTo: '/shared/slider',
      pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SeguridadRoutingModule { }
