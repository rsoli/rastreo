import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MenuRoutingModule } from './menu-routing.module';
import { MisionComponent } from './mision/mision.component';
import { VisionComponent } from './vision/vision.component';
import { ContactoComponent } from './contacto/contacto.component';
import { InteligenciaNegocioComponent } from './servicio/inteligencia-negocio/inteligencia-negocio.component';
import { RastreoSatelitalComponent } from './servicio/rastreo-satelital/rastreo-satelital.component';
import { DesarrolloSoftwareComponent } from './servicio/desarrollo-software/desarrollo-software.component';
import { DisenoWebComponent } from './servicio/diseno-web/diseno-web.component';


@NgModule({
  declarations: [
    MisionComponent,
    VisionComponent,
    ContactoComponent,
    InteligenciaNegocioComponent,
    RastreoSatelitalComponent,
    DesarrolloSoftwareComponent,
    DisenoWebComponent,
  ],
  imports: [
    CommonModule,
    MenuRoutingModule
  ]
})
export class MenuModule { }
