import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SeguridadRoutingModule } from './seguridad-routing.module';
import { ListaUsuarioComponent } from './usuario/lista-usuario/lista-usuario.component';
import { ModalUsuarioComponent } from './usuario/modal-usuario/modal-usuario.component';
import { ListaPersonaComponent } from './persona/lista-persona/lista-persona.component';
import { ModalPersonaComponent } from './persona/modal-persona/modal-persona.component';
import { ListaRolComponent } from './rol/lista-rol/lista-rol.component';
import { ModalRolComponent } from './rol/modal-rol/modal-rol.component';
import { PrimengModule } from '../../componentes/primeng/primeng/primeng.module';


@NgModule({
  declarations: [
    ListaUsuarioComponent,
    ModalUsuarioComponent,
    ListaPersonaComponent,
    ModalPersonaComponent,
    ListaRolComponent,
    ModalRolComponent
  ],
  imports: [
    CommonModule,
    SeguridadRoutingModule,
    PrimengModule
  ]
})
export class SeguridadModule { }
