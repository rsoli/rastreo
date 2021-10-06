import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedRoutingModule } from './shared-routing.module';

import { HeaderComponent } from './header/header.component';
import { SliderComponent } from './slider/slider.component';
import { FooterComponent } from './footer/footer.component';
import { MiniHeaderComponent } from './mini-header/mini-header.component';

import {AccordionModule} from 'primeng/accordion';

import { MenubarModule } from 'primeng/menubar';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import {GalleriaModule} from 'primeng/galleria';
import {ImageModule} from 'primeng/image';
import {SidebarModule} from 'primeng/sidebar';
import { IniciarSesionComponent } from '../paginas/seguridad/usuario/iniciar-sesion/iniciar-sesion.component';
import { FormsModule } from '@angular/forms';
import {PasswordModule} from 'primeng/password';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    HeaderComponent,
    SliderComponent,
    FooterComponent,
    MiniHeaderComponent,
    IniciarSesionComponent
  ],
  imports: [
    CommonModule,
    SharedRoutingModule,
    AccordionModule,
    MenubarModule,
    InputTextModule,
    ButtonModule,
    RippleModule,
    GalleriaModule,
    ImageModule,
    SidebarModule,
    FormsModule,
    PasswordModule,
    ReactiveFormsModule
  ],
  exports:[HeaderComponent,SliderComponent,FooterComponent,MiniHeaderComponent,IniciarSesionComponent]
})
export class SharedModule { }
