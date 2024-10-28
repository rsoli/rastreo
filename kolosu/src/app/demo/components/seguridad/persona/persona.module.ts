import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PersonaRoutingModule } from './persona-routing.module';
import { PersonaComponent } from './persona.component';
import { SharedModule } from 'src/app/shared/shared/shared.module';

@NgModule({
  declarations: [
    PersonaComponent,
  ],
  imports: [
    CommonModule,
    PersonaRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule // Importa SharedModule aquí para tener acceso a los componentes y módulos que exporta
  ],
})
export class PersonaModule { }
