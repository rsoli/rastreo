import { Component, OnInit, ViewChild } from '@angular/core';
import { ChoferModelo } from '../chofer-modelo';
import { ChoferService } from '../chofer.service';
import { Table } from 'primeng/table';
import { MessageService } from 'primeng/api';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import {ModalChoferComponent} from '../modal-chofer/modal-chofer.component';
import Swal from'sweetalert2';

@Component({
  selector: 'app-lista-chofer',
  templateUrl: './lista-chofer.component.html',
  styleUrls: ['./lista-chofer.component.css'],
  providers: [MessageService]
})
export class ListaChoferComponent implements OnInit {

  lista_choferes :Array<ChoferModelo>=[];
  loading: boolean = true;
  @ViewChild('dt') table!: Table;
  chofer_seleccionado=new ChoferModelo();
  public modalRef!: BsModalRef;

  constructor(
    private chofer_servicio:ChoferService,
    private messageService: MessageService,
    private modalService: BsModalService
  ) { }

  ngOnInit(): void {
    this.GetChoferes();
  }
  GetChoferes() {
    this.chofer_servicio.get_choferes().subscribe(data=>{
      this.loading = false;
      this.lista_choferes=JSON.parse(JSON.stringify(data)).lista_chofer;
      console.log(" lista chofer ",this.lista_choferes);
      
      // console.log("ver res ",this.lista_persona);
    })
  }
  SeleccionarPersona(chofer:ChoferModelo){
    this.BorrarToast();
    this.chofer_seleccionado=chofer;
    this.messageService.add({severity: 'info', summary: 'Chofer seleccionado', detail: (this.chofer_seleccionado.nombre).toString()+' '+(this.chofer_seleccionado.apellido_paterno).toString()+' '+(this.chofer_seleccionado.apellido_materno).toString() });
  
  }
  FormularioChofer(bandera:number){
    this.BorrarToast();
    if(bandera==0){
      let nuevo_chofer =new ChoferModelo();
      this.modalRef = this.modalService.show(ModalChoferComponent);
      this.modalRef.content.titulo="Nuevo chofer";
      this.modalRef.content.chofer=nuevo_chofer;

      this.modalRef.onHide?.subscribe((reasor: string|any)=>{
        this.GetChoferes();
      });
    }
    else{
      if(this.chofer_seleccionado.id_chofer==0){
        this.messageService.add({severity:'warn', summary: 'Alerta', detail: 'Seleccione un chofer para editar'});
      }else{
        this.modalRef = this.modalService.show(ModalChoferComponent);
        this.modalRef.content.titulo="Editar chofer";  
        this.modalRef.content.chofer=this.chofer_seleccionado;
        this.modalRef.content.IniciarFormulario();
        this.modalRef.onHide?.subscribe((reasor: string|any)=>{
          this.GetChoferes();
        });
      }
    }
  }
  EliminarChofer(){
    this.BorrarToast();
    if(this.chofer_seleccionado.id_chofer){

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
            this.loading_alert("Eliminando");
            this.chofer_servicio.eliminar_chofer(this.chofer_seleccionado.id_chofer).subscribe(data=>{
              this.closeLoading_alert();
              this.GetChoferes();
            })
          }
        })

    }else{  
      this.messageService.add({severity:'warn', summary: 'Alerta', detail: 'Seleccione una personna para eliminar'});
    }
  }
  BorrarToast() {
    this.messageService.clear();
  }
  loading_alert(titulo:string){

    Swal.fire({
      title: titulo,
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
