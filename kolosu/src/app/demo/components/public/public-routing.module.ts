import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [RouterModule.forChild([
        { path: 'inicio', loadChildren: () => import('./inicio/inicio.module').then(m => m.InicioModule) },
        { path: 'contacto', loadChildren: () => import('./contacto/contacto.module').then(m => m.ContactoModule) },
        { path: 'sobre-nosotros', loadChildren: () => import('./sobre-nosotros/sobre-nosotros.module').then(m => m.SobreNosotrosModule) },
        { path: 'inteligencia-negocio', loadChildren: () => import('./inteligencia-negocio/inteligencia-negocio.module').then(m => m.InteligenciaNegocioModule) },
        { path: 'rastreo-satelital', loadChildren: () => import('./rastreo-satelital/rastreo-satelital.module').then(m => m.RastreoSatelitalModule) },
        { path: 'desarrollo-software', loadChildren: () => import('./desarrollo-software/desarrollo-software.module').then(m => m.DesarrolloSoftwareModule) },
        { path: '**', redirectTo: '/notfound' }
    ])], 
  
  exports: [RouterModule]
})
export class PublicRoutingModule { }
