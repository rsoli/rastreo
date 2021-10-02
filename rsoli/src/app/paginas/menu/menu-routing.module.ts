import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';



import { MisionComponent } from './mision/mision.component';
import { VisionComponent } from './vision/vision.component';
import { ContactoComponent } from './contacto/contacto.component';
import { InteligenciaNegocioComponent } from './servicio/inteligencia-negocio/inteligencia-negocio.component';
import { RastreoSatelitalComponent } from './servicio/rastreo-satelital/rastreo-satelital.component';
import { DesarrolloSoftwareComponent } from './servicio/desarrollo-software/desarrollo-software.component';
import { DisenoWebComponent } from './servicio/diseno-web/diseno-web.component';


export const routes: Routes = [
  {
      path: 'mision',
      component: MisionComponent
  },
  {
      path: 'vision',
      component: VisionComponent
  },
  {
    path: 'contacto',
    component: ContactoComponent
  },
  {
    path: 'inteligencia_negocio',
    component: InteligenciaNegocioComponent
  },
  {
    path: 'rastreo-satelital',
    component: RastreoSatelitalComponent
  },
  {
    path: 'desarrollo_software',
    component: DesarrolloSoftwareComponent
  },
  {
    path: 'diseno_web',
    component: DisenoWebComponent
  },

  {
      path: '**',
      redirectTo: '/slider',
      pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MenuRoutingModule { }