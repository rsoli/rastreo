import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { ClienteService } from '../../cliente/cliente.service';
import { ServicioModelo } from '../servicio-modelo';
import Swal from 'sweetalert2';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import {ModalServicioComponent} from '../modal-servicio/modal-servicio.component';


@Component({
  selector: 'app-lista-servicio',
  templateUrl: './lista-servicio.component.html',
  styleUrls: ['./lista-servicio.component.css'],
  providers: [MessageService]
})
export class ListaServicioComponent implements OnInit {

  id_cliente:Number=0;
  @ViewChild('dt') table!: Table;
  loading: boolean = true;
  lista_servicios :Array<ServicioModelo>=[];
  servicio_seleccionado=new ServicioModelo();
  public modalRef!: BsModalRef;

  data_servicio=[];

  constructor(
    private messageService: MessageService,
    private route: ActivatedRoute,
    private cliente_servicio:ClienteService,
    private router: Router,
    private modalService: BsModalService
  ) { }

  ngOnInit(): void {

    this.id_cliente = Number(this.route.snapshot.paramMap.get("id"));
    this.GetServicios();
    console.log("ver id_cliente ",this.id_cliente);

  }
  GetServicios() {
    this.cliente_servicio.get_servicios(Number(this.id_cliente)).subscribe(data=>{
      this.loading = false;
      this.lista_servicios=JSON.parse(JSON.stringify(data)).lista_servicios;
      //  console.log("ver res ",data);
       this.data_servicio=JSON.parse(JSON.stringify(data));
    })
  }
  SeleccionarServicio(servicio:ServicioModelo){
    this.BorrarToast();
    this.servicio_seleccionado=servicio;
    // console.log("seleccion ",this.servicio_seleccionado);
    
    this.messageService.add({severity: 'info', summary: 'Servicio seleccionado', detail: (this.servicio_seleccionado.tipo_servicio).toString() });
  }
  Volver(){
    this.router.navigate(['/rastreo/lista_cliente']); 
  }
  FormularioServicio(bandera:number){
    this.BorrarToast();
    console.log("ver serv ",this.servicio_seleccionado);
    
    if(bandera==0){
      let nuevo_servicio =new ServicioModelo();
      nuevo_servicio.id_cliente= Number(this.id_cliente);
      this.modalRef = this.modalService.show(ModalServicioComponent);
      this.modalRef.content.titulo="Nuevo servicio";
      this.modalRef.content.servicio=nuevo_servicio;
      
      this.modalRef.content.CargarValores(nuevo_servicio,this.data_servicio);
      this.modalRef.content.IniciarFormulario();
      
      this.modalRef.onHide?.subscribe((reasor: string|any)=>{
        this.GetServicios();
      });
    }
    else{
      this.servicio_seleccionado.id_cliente = Number(this.id_cliente);
      if(this.servicio_seleccionado.id_servicio==0){
        this.messageService.add({severity:'warn', summary: 'Alerta', detail: 'Seleccione un servicio para editar'});
      }else{
        
        this.modalRef = this.modalService.show(ModalServicioComponent);
        this.modalRef.content.titulo="Editar servicio";  
        this.modalRef.content.servicio=this.servicio_seleccionado;
        
        this.modalRef.content.CargarValores(this.servicio_seleccionado,this.data_servicio);
        this.modalRef.content.IniciarFormulario();
        
        this.modalRef.onHide?.subscribe((reasor: string|any)=>{
          this.GetServicios();
        });
      }
    }
  }

  EliminarServicio(){
    this.BorrarToast();
    if(this.servicio_seleccionado.id_servicio){

        Swal.fire({
          title: '¿Esta seguro (a)?',
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
            this.cliente_servicio.eliminar_servicio(this.servicio_seleccionado.id_servicio).subscribe(data=>{
              this.closeLoading_alert();
              this.GetServicios();
            })
          }
        })

    }else{  
      this.messageService.add({severity:'warn', summary: 'Alerta', detail: 'Seleccione un servicio para eliminar'});
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
