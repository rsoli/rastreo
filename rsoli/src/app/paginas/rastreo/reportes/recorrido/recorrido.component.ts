import { Component, OnInit } from '@angular/core';
import { MonitoreoService } from '../../monitoreo/monitoreo.service';
import { formatDate } from '@angular/common';
import Swal from'sweetalert2';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-recorrido',
  templateUrl: './recorrido.component.html',
  styleUrls: ['./recorrido.component.css'],
  providers: [MessageService]
})
export class RecorridoComponent implements OnInit {

  fecha_ratreo: Date=new Date();
  hora_inicio=new Date('2023-10-06 01:00:00');
  hora_fin=new Date('2023-10-06 23:59:59');

  visible_filtros: any;
  vehiculo!: any[];
  vehiculo_seleccionado:any;

  lista_recorrido :any=[];
  loading: boolean = true;
  limite_seleccion_vehiculos:number=1;

  constructor(
    private monitoreo_servicio:MonitoreoService
  ) { }

  ngOnInit(): void {
    this.IniciarFiltros();
  }
  IniciarFiltros(){
    this.loading_alert();
    this.monitoreo_servicio.get_filtros_monitoreo().subscribe(data=>{
      // this.closeLoading_alert();

      // console.log("veeeeeer ",data)
      this.vehiculo=JSON.parse(JSON.stringify(data)).lista_vehiculo;
      this.vehiculo_seleccionado=JSON.parse(JSON.stringify(data)).lista_vehiculo[0];

      this.CargarRecorrido();

     
    },
    error=>{
      this.closeLoading_alert();
    })
  }
  CargarRecorrido(){

    this.loading_alert();
    formatDate(this.fecha_ratreo, 'yyyy/MM/dd', 'en-US')
    let f_ini=formatDate(this.fecha_ratreo, 'yyyy/MM/dd', 'en-US')+' '+this.hora_inicio.toLocaleTimeString();
    let f_fin=formatDate(this.fecha_ratreo, 'yyyy/MM/dd', 'en-US')+' '+this.hora_fin.toLocaleTimeString();

    
    this.monitoreo_servicio.post_monitoreo_rutas({id_vehiculos:this.vehiculo_seleccionado.id_vehiculo,fecha_inicio:f_ini,fecha_fin:f_fin}).subscribe(data=>{
      this.loading = false;

      this.closeLoading_alert();
      this.lista_recorrido=JSON.parse(JSON.stringify(data)).lista_monitoreo_tiempo_real;
     
    },
    error=>{
      this.loading = false;
      this.closeLoading_alert();
      console.log("ver errores ",error);
    })
  }
  MostrarFiltros(){
    this.visible_filtros=true;
  }
  loading_alert(){
    Swal.fire({
      title: 'Espere un momento por favor',
      html: 'Cargando',
      allowOutsideClick: false,
      didOpen: () => {
          Swal.showLoading()
      },
    }); 
  }
  closeLoading_alert(){
    Swal.close();
  }

}
