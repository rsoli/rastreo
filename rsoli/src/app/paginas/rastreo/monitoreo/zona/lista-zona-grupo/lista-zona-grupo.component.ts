import { Component, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ZonaService } from '../zona.service';
import { ZonaGrupoModelo } from '../zona-grupo-model';
import { MessageService } from 'primeng/api';

import { Router} from '@angular/router';
import Swal from 'sweetalert2';

// import {ModalZonaGrupoComponent} from '../modal-persona/modal-persona.component';
import {FormularioZonaGrupoComponent} from '../formulario-zona-grupo/formulario-zona-grupo.component';

@Component({
  selector: 'app-lista-zona-grupo',
  templateUrl: './lista-zona-grupo.component.html',
  styleUrls: ['./lista-zona-grupo.component.css'],
  providers: [MessageService]
})
export class ListaZonaGrupoComponent implements OnInit {

  nombre:String="";
  descripcion:String="";
  tipo_area_seleccionado!: any;
  tipo_area!: any[];


  lista_zona_grupo :Array<ZonaGrupoModelo>=[];
  loading: boolean = true;
  zona_grupo_seleccionado=new ZonaGrupoModelo();

  public modalRef!: BsModalRef;

  constructor(
    private zona_grupo_servicio:ZonaService,
    private messageService: MessageService,
    private modalService: BsModalService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.GetZonaGrupo();
  }
	GetZonaGrupo(){
		this.zona_grupo_servicio.get_zona_grupo().subscribe(data=>{
			this.loading = false;
			this.lista_zona_grupo=JSON.parse(JSON.stringify(data)).lista_zona_grupo;
			console.log("ver res ",this.lista_zona_grupo);
		  })
	}
  FormularioZonaGrupo(bandera:number){
    this.BorrarToast();
    if(bandera==0){
      let nuevo_zona_grupo =new ZonaGrupoModelo();
      this.modalRef = this.modalService.show(FormularioZonaGrupoComponent);
      this.modalRef.content.titulo="Nuevo zona grupo";
      this.modalRef.content.persona=nuevo_zona_grupo;

      this.modalRef.onHide?.subscribe((reasor: string|any)=>{
        this.GetZonaGrupo();
      });
    }
    else{
      if(this.zona_grupo_seleccionado.id_zona_grupo==0){
        this.messageService.add({severity:'warn', summary: 'Alerta', detail: 'Seleccione una zona grupo para editar'});
      }else{
        this.modalRef = this.modalService.show(FormularioZonaGrupoComponent);
        this.modalRef.content.titulo="Editar zona grupo";  
        this.modalRef.content.zona_grupo=this.zona_grupo_seleccionado;
        this.modalRef.content.IniciarFormulario();
        this.modalRef.onHide?.subscribe((reasor: string|any)=>{
          this.GetZonaGrupo();
        });
      }
    }
  }
	SeleccionarGeocerca(lista_zona_grupo:ZonaGrupoModelo){
		this.BorrarToast();
		this.zona_grupo_seleccionado=lista_zona_grupo;
		this.messageService.add({severity: 'info', summary: 'Grupo seleccionado', detail: (this.zona_grupo_seleccionado.nombre_grupo).toString() });
	}
  EliminarZonaGrupo(){
    this.BorrarToast();
    if(this.zona_grupo_seleccionado.id_zona_grupo){

        Swal.fire({
          title: '¿Esta seguro(a)?',
          text: "No podra revertir esta acción!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'SI, Eliminar!',
          cancelButtonText: 'Cancelar'
        }).then((result) => {
          if (result.isConfirmed) {

            Swal.fire({
              title: 'Eliminando',
              html: 'Cargando',
              allowOutsideClick: false,
              didOpen: () => {
                Swal.showLoading()
              },
            });

            this.zona_grupo_servicio.eliminar_zona_grupo(this.zona_grupo_seleccionado.id_zona_grupo).subscribe(data=>{
              this.closeLoading_alert();
              this.GetZonaGrupo();
            })
          }
        })

    }else{  
      this.messageService.add({severity:'warn', summary: 'Alerta', detail: 'Seleccione una zona grupo para eliminar'});
    }
  }
  ListaZonaGrupoDetalle(){
    this.BorrarToast();
    if(this.zona_grupo_seleccionado.id_zona_grupo){

      this.router.navigate(['/rastreo/lista_zona_grupo_detalle',this.zona_grupo_seleccionado.id_zona_grupo]); 

    }else{  

      this.messageService.add({severity:'warn', summary: 'Alerta', detail: 'Seleccione un grupo para añadir zonas'});

    }
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
