import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SeguridadRoutingModule } from './seguridad-routing.module';
import { ListaUsuarioComponent } from './usuario/lista-usuario/lista-usuario.component';
import { ModalUsuarioComponent } from './usuario/modal-usuario/modal-usuario.component';
import { ListaPersonaComponent } from './persona/lista-persona/lista-persona.component';
import { ModalPersonaComponent } from './persona/modal-persona/modal-persona.component';


@NgModule({
  declarations: [
    ListaUsuarioComponent,
    ModalUsuarioComponent,
    ListaPersonaComponent,
    ModalPersonaComponent
  ],
  imports: [
    CommonModule,
    SeguridadRoutingModule
  ]
})
export class SeguridadModule { }
