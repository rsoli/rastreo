/*import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forChild([
    { path: 'lista_persona', loadChildren: () => import('./persona/persona.module').then(m => m.PersonaModule) },
    { path: 'lista_rol', loadChildren: () => import('./rol/rol.module').then(m => m.RolModule) },
    { path: 'lista_usuario', loadChildren: () => import('./usuario/usuario.module').then(m => m.UsuarioModule) },
    { path: '**', redirectTo: '/notfound' }
])], 
  
  exports: [RouterModule]
})
export class SeguridadRoutingModule { }
*/

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'lista_persona', loadChildren: () => import('./persona/persona.module').then(m => m.PersonaModule) },
  { path: 'lista_rol', loadChildren: () => import('../seguridad/rol/rol.module').then(m => m.RolComponentModule) },
  { path: 'lista_usuario', loadChildren: () => import('./usuario/usuario.module').then(m => m.UsuarioModule) },
  { path: '**', redirectTo: '/notfound' } // Asegúrate de tener una ruta para '/notfound'
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SeguridadRoutingModule { }
