import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedRoutingModule } from './shared-routing.module';
import { HeaderComponent } from './header/header.component';
import { SliderComponent } from './slider/slider.component';
import { FooterComponent } from './footer/footer.component';
import { MiniHeaderComponent } from './mini-header/mini-header.component';

import { IniciarSesionComponent } from '../paginas/seguridad/usuario/iniciar-sesion/iniciar-sesion.component';
import { ImageModule } from 'primeng/image';
import { GalleriaModule } from 'primeng/galleria';

import { SidebarModule } from 'primeng/sidebar';
import { FormsModule } from '@angular/forms';

import { ReactiveFormsModule } from '@angular/forms';
import { AccordionModule } from 'primeng/accordion';
import { MenubarModule } from 'primeng/menubar';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';

import { SidebarComponent } from './sidebar/sidebar.component';

import { PanelMenuModule } from 'primeng/panelmenu';

import { PasswordModule } from 'primeng/password';
@NgModule({
  declarations: [
    HeaderComponent,
    SliderComponent,
    FooterComponent,
    MiniHeaderComponent,
    IniciarSesionComponent,
    SidebarComponent,
    
  ],
  imports: [
    CommonModule,
    SharedRoutingModule,
    ImageModule,
    GalleriaModule,
    SidebarModule,
    FormsModule,
    ReactiveFormsModule,
    AccordionModule,
    MenubarModule,
    InputTextModule,
    ButtonModule,
    RippleModule,
    PasswordModule,
    ReactiveFormsModule,
    PanelMenuModule,
    
    
  ],
  exports:[HeaderComponent,SliderComponent,FooterComponent,MiniHeaderComponent,IniciarSesionComponent,SidebarComponent],
})
export class SharedModule { }
