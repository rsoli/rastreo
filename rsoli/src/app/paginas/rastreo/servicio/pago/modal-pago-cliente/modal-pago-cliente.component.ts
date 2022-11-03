import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { PagosClienteModelo } from '../pago-cliente/pagos-cliente-modelo';
import { ClienteService } from '../../cliente/cliente.service';
import Swal from'sweetalert2';
import { formatDate } from '@angular/common';

import { TipoServicioModelo } from '../../../servicio/cliente/tipo-servicio-modelo';

@Component({
  selector: 'app-modal-pago-cliente',
  templateUrl: './modal-pago-cliente.component.html',
  styleUrls: ['./modal-pago-cliente.component.css']
})
export class ModalPagoClienteComponent implements OnInit {

  @Input() titulo: string = "";
  form_pago!: FormGroup;
  @Input() pago = new PagosClienteModelo();
  lista_tipo_servicio :Array<TipoServicioModelo>=[];
  lista_tipo_servicio_seleccionado = new TipoServicioModelo();
  
  constructor(
    public bsModalRef: BsModalRef,
    private cliente_service:ClienteService,
  ) { }

  ngOnInit(): void {
    this.IniciarFormulario();
  }
  IniciarFormulario(){
    if(this.pago.id_pago_servicio==0){
      this.form_pago= new FormGroup({
        fecha_inicio: new FormControl('', [Validators.required,Validators.maxLength(50)]),
        fecha_fin: new FormControl('', [Validators.required,Validators.maxLength(50)]),
        fecha_pago: new FormControl('', [Validators.required,Validators.maxLength(50)]),
        precio_mensual: new FormControl('', [Validators.required,Validators.maxLength(50)]),
        cantidad_vehiculos: new FormControl('', [Validators.required,Validators.maxLength(50)]),
        cantidad_meses: new FormControl('', [Validators.required,Validators.maxLength(50)]),
        sub_total: new FormControl('', [Validators.required,Validators.maxLength(50)]),
        lista_tipo_servicio_seleccionado:new FormControl(this.lista_tipo_servicio_seleccionado, [Validators.required]),
      }); 
    }else{
       this.form_pago = new FormGroup({
        fecha_inicio: new FormControl(this.pago.fecha_inicio, [Validators.required,Validators.maxLength(50)]),
        fecha_fin: new FormControl(this.pago.fecha_fin, [Validators.required,Validators.maxLength(50)]),
        fecha_pago: new FormControl(this.pago.fecha_pago, [Validators.required,Validators.maxLength(50)]),
        precio_mensual: new FormControl(this.pago.precio_mensual, [Validators.required,Validators.maxLength(50)]),
        cantidad_vehiculos: new FormControl(this.pago.cantidad_vehiculos, [Validators.required,Validators.maxLength(50)]),
        cantidad_meses: new FormControl(this.pago.cantidad_meses, [Validators.required,Validators.maxLength(50)]),
        sub_total: new FormControl(this.pago.sub_total, [Validators.required,Validators.maxLength(50)]),
        lista_tipo_servicio_seleccionado:new FormControl(this.lista_tipo_servicio_seleccionado, [Validators.required]),
       }); 
    }
  }
  GuardarPago(){

  // console.log(this.form_pago.controls.lista_tipo_servicio_seleccionado.value.id_servicio);
  

    this.loading();
    
    let nuevo_pago=new PagosClienteModelo();

    nuevo_pago.fecha_inicio=new Date(formatDate(this.form_pago.controls.fecha_inicio.value, 'yyyy/MM/dd', 'en-US'));
    nuevo_pago.fecha_fin=new Date(formatDate(this.form_pago.controls.fecha_fin.value, 'yyyy/MM/dd', 'en-US'));
    nuevo_pago.fecha_pago=new Date(formatDate(this.form_pago.controls.fecha_pago.value, 'yyyy/MM/dd', 'en-US'));
    nuevo_pago.precio_mensual=this.form_pago.controls.precio_mensual.value;
    nuevo_pago.cantidad_vehiculos=this.form_pago.controls.cantidad_vehiculos.value;
    nuevo_pago.cantidad_meses=this.form_pago.controls.cantidad_meses.value;
    nuevo_pago.sub_total=this.form_pago.controls.sub_total.value;
    nuevo_pago.id_pago_servicio = this.pago.id_pago_servicio;
   

    var nuevo2_cliente = [{
      id_pago_servicio: nuevo_pago.id_pago_servicio,
      fecha_inicio: String( formatDate(this.form_pago.controls.fecha_inicio.value, 'yyyy/MM/dd', 'en-US')),
      fecha_fin: String(formatDate(this.form_pago.controls.fecha_fin.value, 'yyyy/MM/dd', 'en-US')),
      fecha_pago:String(formatDate(this.form_pago.controls.fecha_pago.value, 'yyyy/MM/dd', 'en-US')),
      precio_mensual:this.form_pago.controls.precio_mensual.value,
      cantidad_vehiculos:this.form_pago.controls.cantidad_vehiculos.value,
      cantidad_meses:this.form_pago.controls.cantidad_meses.value,
      sub_total:this.form_pago.controls.sub_total.value,
      id_cliente: this.pago.id_cliente,
      id_servicio:this.form_pago.controls.lista_tipo_servicio_seleccionado.value.id_servicio
      }
    ];

    console.log("veee ",nuevo2_cliente[0]);
    this.cliente_service.post_pagos_cliente(nuevo2_cliente[0]).subscribe(data=>{
      this.close();
      console.log("ver res ",data);
      
      if(JSON.parse(JSON.stringify(data)).mensaje[0]){
        this.error('Error!!',JSON.parse(JSON.stringify(data)).mensaje[0]);
      }else{
        this.bsModalRef.hide();
      }
    },error=>{
      this.close();
      this.error("Error","Verifique su conexion a internet");
      console.log(error);
    });
    

  }
  CargarValores(pagos:PagosClienteModelo,lista_tipo_servicio:TipoServicioModelo){

    this.loading();
    if(Number(pagos.id_pago_servicio) != 0){
      this.cliente_service.get_pago_cliente(Number(pagos.id_pago_servicio)).subscribe(data=>{
        this.close();
        this.lista_tipo_servicio_seleccionado=JSON.parse(JSON.stringify(data)).lista_tipo_pago_seleccionado[0];
        this.form_pago.controls.lista_tipo_servicio_seleccionado.setValue( this.lista_tipo_servicio_seleccionado );
        this.pago=pagos;
        this.form_pago.controls.fecha_inicio.setValue( new Date(String(formatDate( pagos.fecha_inicio, 'yyyy/MM/dd', 'en-US')))  );
        this.form_pago.controls.fecha_fin.setValue( new Date(String(formatDate( pagos.fecha_fin, 'yyyy/MM/dd', 'en-US')))  );
        this.form_pago.controls.fecha_pago.setValue( new Date(String(formatDate( pagos.fecha_pago, 'yyyy/MM/dd', 'en-US')))   );
        this.form_pago.controls.precio_mensual.setValue(pagos.precio_mensual);
        this.form_pago.controls.cantidad_vehiculos.setValue(pagos.cantidad_vehiculos);
        this.form_pago.controls.cantidad_meses.setValue(pagos.cantidad_meses);
        this.form_pago.controls.sub_total.setValue(pagos.sub_total);
      
        this.lista_tipo_servicio = JSON.parse( JSON.stringify(lista_tipo_servicio));
        console.log("llego",this.lista_tipo_servicio_seleccionado,this.lista_tipo_servicio);
  
       //  console.log("ver res ",JSON.parse(JSON.stringify(data)).lista_tipo_servicio);
     })
    }else{
      this.close();
      this.lista_tipo_servicio_seleccionado=new TipoServicioModelo();

      this.pago=pagos;
      this.form_pago.controls.fecha_inicio.setValue( new Date(String(formatDate( pagos.fecha_inicio, 'yyyy/MM/dd', 'en-US')))  );
      this.form_pago.controls.fecha_fin.setValue( new Date(String(formatDate( pagos.fecha_fin, 'yyyy/MM/dd', 'en-US')))  );
      this.form_pago.controls.fecha_pago.setValue( new Date(String(formatDate( pagos.fecha_pago, 'yyyy/MM/dd', 'en-US')))   );
      this.form_pago.controls.precio_mensual.setValue(pagos.precio_mensual);
      this.form_pago.controls.cantidad_vehiculos.setValue(pagos.cantidad_vehiculos);
      this.form_pago.controls.cantidad_meses.setValue(pagos.cantidad_meses);
      this.form_pago.controls.sub_total.setValue(pagos.sub_total);
    
      this.lista_tipo_servicio = JSON.parse( JSON.stringify(lista_tipo_servicio));

    }



    //  this.pago=pagos;
  }
  loading(){
    Swal.fire({
      title: 'Verificando datos',
      html: 'Cargando',// add html attribute if you want or remove
      allowOutsideClick: false,
      didOpen: () => {
          Swal.showLoading()
      },
    });
  }
  close(){
    Swal.close();
  }
  error(titulo:string,mensaje:string){
    Swal.fire({
      icon: 'error',
      title: titulo,
      text: mensaje
    });
  }
}
