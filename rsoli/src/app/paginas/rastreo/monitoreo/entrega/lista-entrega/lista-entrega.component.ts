import { Component, OnInit, ViewChild } from '@angular/core';
import { EntregaModelo } from '../entrega-modelo';
import { EntregaService } from '../entrega.service';
import { Table } from 'primeng/table';
import { MessageService } from 'primeng/api';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import {ModalEntregaComponent} from '../modal-entrega/modal-entrega.component';
import Swal from'sweetalert2';
@Component({
  selector: 'app-lista-entrega',
  templateUrl: './lista-entrega.component.html',
  styleUrls: ['./lista-entrega.component.css'],
  providers: [MessageService]
})
export class ListaEntregaComponent implements OnInit {

  lista_entrega :Array<EntregaModelo>=[];
  loading: boolean = true;
  @ViewChild('dt') table!: Table;
  entrega_seleccionado=new EntregaModelo();
  public modalRef!: BsModalRef;

  constructor(
    private entrega_servicio:EntregaService,
    private messageService: MessageService,
    private modalService: BsModalService
  ) { }

  ngOnInit(): void {
    this.GetEntregas();
  }
  GetEntregas() {
    this.entrega_servicio.get_entregas().subscribe(data=>{
      this.loading = false;
      this.lista_entrega=JSON.parse(JSON.stringify(data)).lista_entrega;
      
      console.log(" lista entrega ",this.lista_entrega);
      
      // console.log("ver res ",this.lista_persona);
    })
  }
  SeleccionarEntrega(entrega:EntregaModelo){
    this.BorrarToast();
    this.entrega_seleccionado=entrega;
    this.messageService.add({severity: 'info', summary: 'entrega seleccionado', detail: ('Origen '+this.entrega_seleccionado.destino).toString()+' Destino'+(this.entrega_seleccionado.destino).toString() });
  
  }
  FormularioEntrega(bandera:number){
    this.BorrarToast();
    if(bandera==0){
      let nuevo_entrega =new EntregaModelo();
      this.modalRef = this.modalService.show(ModalEntregaComponent);
      this.modalRef.content.titulo="Nueva Planificación";
      this.modalRef.content.entrega=nuevo_entrega;
      this.modalRef.content.CargarValores();
      //this.modalRef.content.IniciarFormulario();
      this.modalRef.onHide?.subscribe((reasor: string|any)=>{
        this.GetEntregas();
      });
    }
    else{
      if(this.entrega_seleccionado.id_entrega==0){
        this.messageService.add({severity:'warn', summary: 'Alerta', detail: 'Seleccione una entrega para editar'});
      }else{
        this.modalRef = this.modalService.show(ModalEntregaComponent);
        this.modalRef.content.titulo="Editar planificación";  
        this.modalRef.content.chofer=this.entrega_seleccionado;
        this.modalRef.content.CargarValores();
        this.modalRef.content.IniciarFormulario();
        this.modalRef.onHide?.subscribe((reasor: string|any)=>{
          this.GetEntregas();
        });
      }
    }
  }
  BorrarToast() {
    this.messageService.clear();
  }


}
