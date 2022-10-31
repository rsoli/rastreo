import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Table } from 'primeng/table';
import { ClienteService } from '../../cliente/cliente.service';
import { PagosClienteModelo } from './pagos-cliente-modelo';
import { MessageService } from 'primeng/api';

import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import {ModalPagoClienteComponent} from '../modal-pago-cliente/modal-pago-cliente.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pago-cliente',
  templateUrl: './pago-cliente.component.html',
  styleUrls: ['./pago-cliente.component.css'],
  providers: [MessageService]
})
export class PagoClienteComponent implements OnInit {

  id_cliente:Number=0;
  lista_pagos :Array<PagosClienteModelo>=[];
  @ViewChild('dt') table!: Table;
  loading: boolean = true;
  pago_seleccionado=new PagosClienteModelo();
  public modalRef!: BsModalRef;

  constructor(
    private route: ActivatedRoute,
    private cliente_service:ClienteService,
    private messageService: MessageService,
    private modalService: BsModalService,
    private router: Router
  ) { }

  ngOnInit(): void {

    this.id_cliente = Number(this.route.snapshot.paramMap.get("id"));
    this.GetPagos();
    console.log("ver id_cliente ",this.id_cliente);

  }
  GetPagos(){
    this.cliente_service.get_pagos_cliente(Number(this.id_cliente)).subscribe(data=>{
       this.loading = false;
       this.lista_pagos=JSON.parse(JSON.stringify(data)).pago_servicio;
       console.log("ver res ",this.lista_pagos);
    })
  }
  FormularioVehiculo(bandera:Number){
    this.BorrarToast();
    if(bandera==0){
      let nuevo_pago_cliente =new PagosClienteModelo();
      nuevo_pago_cliente.id_cliente= Number(this.id_cliente);
      this.modalRef = this.modalService.show(ModalPagoClienteComponent);
      this.modalRef.content.titulo="Nuevo pago";
      // this.modalRef.content.pago=nuevo_pago_cliente;
      this.modalRef.content.IniciarFormulario();
      this.modalRef.content.CargarValores(nuevo_pago_cliente);
      this.modalRef.onHide?.subscribe((reasor: string|any)=>{
        this.GetPagos();
      });
    }
    else{
      if(this.pago_seleccionado.id_pago_servicio==0){
        this.messageService.add({severity:'warn', summary: 'Alerta', detail: 'Seleccione un pago para editar'});
      }else{
       
        this.pago_seleccionado.id_cliente= Number(this.id_cliente);
        this.modalRef = this.modalService.show(ModalPagoClienteComponent);
        this.modalRef.content.titulo="Editar pago";  
        this.modalRef.content.IniciarFormulario();
        // this.modalRef.content.pago.fecha_inicio=this.pago_seleccionado.fecha_inicio;
        this.modalRef.content.CargarValores(this.pago_seleccionado);
        this.modalRef.onHide?.subscribe((reasor: string|any)=>{
          this.GetPagos();
        });
      }
    }
  }
  EliminarPago(){

      this.BorrarToast();
      if(this.pago_seleccionado.id_pago_servicio){
  
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
              this.loading_alert();
              this.cliente_service.eliminar_pagos_cliente(this.pago_seleccionado.id_pago_servicio).subscribe(data=>{
                this.closeLoading_alert();
                this.GetPagos();
              })
            }
          })
  
      }else{  
        this.messageService.add({severity:'warn', summary: 'Alerta', detail: 'Seleccione un vehículo para eliminar'});
      }
    
  }
  Volver(){
    this.router.navigate(['/rastreo/lista_cliente']); 
  }
  SeleccionarPago(pago:PagosClienteModelo){
    this.BorrarToast();
    this.pago_seleccionado=pago;
    this.messageService.add({severity: 'info', summary: 'Pago seleccionado', detail: ' Fecha inicio '+this.pago_seleccionado.fecha_inicio});

  }
  BorrarToast() {
    this.messageService.clear();
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
