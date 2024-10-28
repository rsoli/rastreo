import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimengModule } from 'src/app/shared/primeng/primeng.module';
import { LoadingComponent } from '../loading/loading.component';
import { TablaDinamicaComponent } from '../tabla-dinamica/tabla-dinamica.component';
import { ReactiveFormsModule } from '@angular/forms'; 
import { MapComponent } from '../map/map.component';
import { ModalDinamicaComponent } from '../modal-dinamica/modal-dinamica.component';
import { ReporteModalDinamicaComponent } from '../reporte-modal-dinamica/reporte-modal-dinamica.component';
import { OverlayPanelDinamicoComponent } from '../overlay-panel-dinamico/overlay-panel-dinamico.component';

@NgModule({
  declarations: [
    LoadingComponent,
    TablaDinamicaComponent,
    MapComponent,
    ModalDinamicaComponent,
    ReporteModalDinamicaComponent,
    OverlayPanelDinamicoComponent
  ],
  imports: [
    CommonModule,
    PrimengModule,
    ReactiveFormsModule
  ],
  exports: [
    LoadingComponent,
    PrimengModule, 
    TablaDinamicaComponent,
    MapComponent,
    ModalDinamicaComponent,
    ReporteModalDinamicaComponent,
    OverlayPanelDinamicoComponent

  ]
})
export class SharedModule { }
