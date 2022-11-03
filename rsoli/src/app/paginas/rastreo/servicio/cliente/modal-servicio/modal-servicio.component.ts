import { Component,Input, OnInit } from '@angular/core';
import Swal from'sweetalert2';
import { ClienteService } from '../cliente.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ServicioModelo } from '../servicio-modelo';

@Component({
  selector: 'app-modal-servicio',
  templateUrl: './modal-servicio.component.html',
  styleUrls: ['./modal-servicio.component.css']
})
export class ModalServicioComponent implements OnInit {

  @Input() titulo: string = "";
  form_servicio!: FormGroup;
  @Input() servicio= new ServicioModelo();
  id_servicio= 0;
  id_cliente = 0;

  lista_servicios_seleccionados=new Array();
  lista_servicios :Array<ServicioModelo>=[];
  // filtro_servicios!: any[];

  constructor(
    public bsModalRef: BsModalRef,
    private cliente_servicio:ClienteService
  ) { }

  ngOnInit(): void {
    this.IniciarFormulario();
  }
  GuardarServicio(){

    let nuevo_servicio = new ServicioModelo();
    console.log(this.form_servicio.controls);
    nuevo_servicio.id_cliente=this.id_cliente;
    nuevo_servicio.id_servicio=this.id_servicio;
    nuevo_servicio.id_tipo_servicio=this.form_servicio.controls.lista_servicios_seleccionados.value.id_tipo_servicio;
    nuevo_servicio.costo_total = Number(this.form_servicio.controls.costo_total.value);
    console.log(nuevo_servicio);


      this.loading();

       this.cliente_servicio.post_servicio(nuevo_servicio).subscribe(data=>{
         this.close();
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
  IniciarFormulario(){
    if(this.servicio.id_servicio==0){
      this.form_servicio = new FormGroup({
        lista_servicios_seleccionados: new FormControl(this.lista_servicios_seleccionados, [Validators.required]),
        costo_total: new FormControl('', [Validators.required,Validators.maxLength(100)]),
      }); 
    }else{
       this.form_servicio = new FormGroup({
        lista_servicios_seleccionados: new FormControl(this.lista_servicios_seleccionados, [Validators.required]),
        costo_total: new FormControl(this.servicio.costo_total, [Validators.required,Validators.maxLength(50)]),
       }); 
    }
  }
  CargarValores(servicio:ServicioModelo,data:any){
    
    this.servicio=servicio;
    this.lista_servicios = data.lista_tipo_servicio;
    this.form_servicio.controls.costo_total.setValue( servicio.costo_total  );
    // this.form_servicio.controls.lista_servicios_seleccionados.setValue( JSON.parse(JSON.stringify(data.lista_tipo_servicio_seleccionado)) );

    if(this.servicio.id_servicio==0){
      this.lista_servicios_seleccionados = [];
      this.id_cliente=servicio.id_cliente;
      this.id_servicio=0;
    }else{
      this.lista_servicios_seleccionados.push  (
        {
          codigo:servicio.codigo,
          id_tipo_servicio:servicio.id_tipo_servicio,
          tipo_servicio:servicio.tipo_servicio,
        });
        this.id_cliente=servicio.id_cliente;
        this.id_servicio=servicio.id_servicio;
        this.lista_servicios_seleccionados = this.lista_servicios_seleccionados[0];  
        console.log(this.lista_servicios,this.lista_servicios_seleccionados);
        
    }
    
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
