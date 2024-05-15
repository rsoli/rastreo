import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Table } from 'primeng/table';
import { ZonaService } from '../zona.service';
import { ZonaGrupoDetalleModelo } from '../zona-grupo-detalle-model';
import { MessageService } from 'primeng/api';

import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import {FormularioZonaGrupoDetalleComponent} from '../formulario-zona-grupo-detalle/formulario-zona-grupo-detalle.component';
import Swal from 'sweetalert2';
//import { TipoServicioModelo } from '../../../servicio/cliente/tipo-servicio-modelo';


@Component({
  selector: 'app-lista-zona-grupo-detalle',
  templateUrl: './lista-zona-grupo-detalle.component.html',
  styleUrls: ['./lista-zona-grupo-detalle.component.css'],
  providers: [MessageService]
})
export class ListaZonaGrupoDetalleComponent implements OnInit {

  id_zona_grupo:Number=0;
  lista_zona_grupo_detalle :Array<ZonaGrupoDetalleModelo>=[];
  @ViewChild('dt') table!: Table;
  loading: boolean = true;
  zona_grupo_detalle_seleccionado=new ZonaGrupoDetalleModelo();
  public modalRef!: BsModalRef;
  //lista_tipo_servicio = new TipoServicioModelo();
  constructor(
    private route: ActivatedRoute,
    private zona_service:ZonaService,
    private messageService: MessageService,
    private modalService: BsModalService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.id_zona_grupo = Number(this.route.snapshot.paramMap.get("id"));
    this.ListaZonaGrupoDetalle();
    console.log("ver id_zona_grupo ",this.id_zona_grupo);
  }
	ListaZonaGrupoDetalle(){
		this.zona_service.get_zona_grupo_detalle(Number(this.id_zona_grupo)).subscribe(data=>{
			this.loading = false;
			this.lista_zona_grupo_detalle=JSON.parse(JSON.stringify(data)).lista_zona_grupo_detalle;
			//console.log("ver res ",this.lista_zona_grupo_detalle);
		  })
	}
	SeleccionarZonaGrupoDetalle(lista_zona_grupo_detalle:ZonaGrupoDetalleModelo){
		this.BorrarToast();
		this.zona_grupo_detalle_seleccionado=lista_zona_grupo_detalle;
		this.messageService.add({severity: 'info', summary: 'Grupo detalle seleccionado', detail: (this.zona_grupo_detalle_seleccionado.zona).toString() });
	}
  EliminarZonaGrupoDetalle(){
    this.BorrarToast();
    if(this.zona_grupo_detalle_seleccionado.id_zona_grupo_detalle){

        Swal.fire({
          title: '¿Esta segur@?',
          text: "No podra revertir esta acción!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'SI, Eliminar!',
          cancelButtonText: 'Cancelar'
        }).then((result) => {
          if (result.isConfirmed) {
            this.loading_alert();
            this.zona_service.eliminar_zona_grupo_detalle(this.zona_grupo_detalle_seleccionado.id_zona_grupo_detalle).subscribe(data=>{
              this.closeLoading_alert();
              this.ListaZonaGrupoDetalle();
            })
          }
        })

    }else{  
      this.messageService.add({severity:'warn', summary: 'Alerta', detail: 'Seleccione una zona grupo detalle para eliminar'});
    }
  }
  FormularioZonaGrupoDetalle(bandera:number){
    this.BorrarToast();
    if(bandera==0){
      let nuevo_zona_grupo_detalle =new ZonaGrupoDetalleModelo();
      nuevo_zona_grupo_detalle.id_zona_grupo = Number(this.id_zona_grupo);

      this.modalRef = this.modalService.show(FormularioZonaGrupoDetalleComponent);
      this.modalRef.content.titulo="Nueva zona grupo detalle";
      this.modalRef.content.zona_grupo_detalle_modelo=nuevo_zona_grupo_detalle;
      this.modalRef.content.CargarValores();
      this.modalRef.content.IniciarFormulario();
      this.modalRef.onHide?.subscribe((reasor: string|any)=>{
        this.ListaZonaGrupoDetalle();
      });
    }
    else{
      if(this.zona_grupo_detalle_seleccionado.id_zona_grupo_detalle==0){
        this.messageService.add({severity:'warn', summary: 'Alerta', detail: 'Seleccione una zona grupo detalle para editar'});
      }else{
        
        this.modalRef = this.modalService.show(FormularioZonaGrupoDetalleComponent);
        this.modalRef.content.titulo="Editar zona grupo detalle";  
        this.modalRef.content.zona_grupo_detalle_modelo=this.zona_grupo_detalle_seleccionado;
        this.modalRef.content.CargarValores();
        this.modalRef.content.IniciarFormulario();
        this.modalRef.onHide?.subscribe((reasor: string|any)=>{
          this.ListaZonaGrupoDetalle();
        });
      }
    }
  }
  Volver(){
    this.router.navigate(['/rastreo/lista_zona_grupo']); 
  }
	loading_alert(){
		Swal.fire({
		  title: 'Verificando datos',
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
	BorrarToast() {
		this.messageService.clear();
	}
}
