import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InicioComponent } from './inicio/inicio.component';
import { SharedRoutingModule } from './shared-routing.module';
import { PrimengModule } from '../componentes/primeng/primeng/primeng.module';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { ServiciosComponent } from './servicios/servicios.component';
import { Servicios2Component } from './servicios2/servicios2.component';
import { Servicios3Component } from './servicios3/servicios3.component';
import { Servicios4Component } from './servicios4/servicios4.component';
import { ContactoComponent } from './contacto/contacto.component';


@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    InicioComponent,
    ServiciosComponent,
    Servicios2Component,
    Servicios3Component,
    Servicios4Component,
    ContactoComponent
  ],
  imports: [
    CommonModule,
    SharedRoutingModule,
    PrimengModule,

  ],
  exports:[HeaderComponent,InicioComponent,FooterComponent,ServiciosComponent,Servicios2Component,Servicios3Component,Servicios4Component,ContactoComponent],
})
export class SharedModule { }
