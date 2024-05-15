import { Component,Input, OnInit } from '@angular/core';

import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ZonaService } from '../zona.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
//import { ClienteModelo } from '../cliente-modelo';
import Swal from'sweetalert2';
import { PersonaModelo } from 'src/app/paginas/seguridad/persona/persona-modelo';
import { ZonaModelo } from '../zona-model';
import { ZonaGrupoDetalleModelo } from '../zona-grupo-detalle-model';

@Component({
  selector: 'app-formulario-zona-grupo-detalle',
  templateUrl: './formulario-zona-grupo-detalle.component.html',
  styleUrls: ['./formulario-zona-grupo-detalle.component.css']
})
export class FormularioZonaGrupoDetalleComponent implements OnInit {

  @Input() titulo: string = "";
  form_zona_grupo_detalle!: FormGroup;
  @Input() zona_grupo_detalle_modelo= new ZonaGrupoDetalleModelo();

  lista_zona_seleccionados:ZonaModelo = new ZonaModelo();
  lista_zona :Array<ZonaModelo>=[];
  filtro_personas!: any[];

  constructor(
    public bsModalRef: BsModalRef,
    private zona_servicio:ZonaService
  ) { }

  ngOnInit(): void {
    this.IniciarFormulario();
  }
  IniciarFormulario(){
    if(this.zona_grupo_detalle_modelo.id_zona_grupo_detalle==0){
      this.form_zona_grupo_detalle = new FormGroup({
        lista_zona_seleccionados: new FormControl(this.lista_zona_seleccionados, [Validators.required]),
        //direccion: new FormControl(this.cliente.direccion, [Validators.required,Validators.maxLength(100)]),
      }); 
    }else{
       this.form_zona_grupo_detalle = new FormGroup({
        lista_zona_seleccionados: new FormControl(this.lista_zona_seleccionados, [Validators.required]),
         //direccion: new FormControl(this.cliente.direccion, [Validators.required,Validators.maxLength(100)]),
       }); 
    }
  }
  CargarValores(){
    
    this.loading();
    console.log("ver datos",this.zona_grupo_detalle_modelo.id_zona_grupo_detalle);
    this.zona_servicio.get_zona(this.zona_grupo_detalle_modelo.id_zona_grupo_detalle).subscribe(data=>{  
     
      this.close();
      this.lista_zona = JSON.parse(JSON.stringify(data)).lista_zonas;
      
      if(this.zona_grupo_detalle_modelo.id_zona_grupo_detalle!=0){
        console.log("ver ",data);
        //this.zona_grupo_detalle_modelo=JSON.parse(JSON.stringify(data)).cliente[0];
        //this.zona_grupo_detalle_modelo.direccion=JSON.parse(JSON.stringify(data)).cliente[0].direccion;
        this.lista_zona_seleccionados=JSON.parse(JSON.stringify(data)).lista_zonas_seleecionado[0];
      }else{

        //this.zona_grupo_detalle_modelo.direccion="";
        this.lista_zona_seleccionados = new ZonaModelo();
      }
      this.IniciarFormulario();

    },
    error=>{
        this.close();
        this.error("Error","Verifique su conexion internet");
    })

  }
  GuardarZonaGrupoDetalle(){
    this.loading();
    // console.log("formulario id ",this.form_zona_grupo_detalle.controls.lista_zona_seleccionados.value.id);
    console.log("id_zona_grupo_detalle id ",this.zona_grupo_detalle_modelo.id_zona_grupo_detalle);
    console.log("id_zona_grupo ",this.zona_grupo_detalle_modelo.id_zona_grupo);
    console.log("id_usuario geocerca ",this.form_zona_grupo_detalle.controls.lista_zona_seleccionados.value.id_usuario_geocerca);
    
    let nuevo_zona_grupo_detalle = new ZonaGrupoDetalleModelo();
    nuevo_zona_grupo_detalle.id_zona_grupo_detalle = this.zona_grupo_detalle_modelo.id_zona_grupo_detalle;
    nuevo_zona_grupo_detalle.id_zona_grupo = this.zona_grupo_detalle_modelo.id_zona_grupo;
    nuevo_zona_grupo_detalle.id_usuario_geocerca = this.form_zona_grupo_detalle.controls.lista_zona_seleccionados.value.id_usuario_geocerca;

    if(this.form_zona_grupo_detalle.controls.lista_zona_seleccionados.value.id_usuario_geocerca == undefined){
      this.error("Error","El campo zona es requerido");

    }else{
      
      this.zona_servicio.post_zona_grupo_detalle(nuevo_zona_grupo_detalle).subscribe(data=>{
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
    /*this.loading();
    this.zona_servicio.post_zona_grupo_detalle(nuevo_zona_grupo_detalle).subscribe(data=>{
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
    });*/
  

//id_geocerca  = this.form_zona_grupo_detalle.controls.lista_zona_seleccionados.value.id;



    /*
    if(this.form_zona_grupo_detalle.controls.lista_zona_seleccionados.value.nombre==""){
      this.error("Error","El campo persona es requerido");

    }else{
      this.loading();

      console.log("ver form ",this.form_zona_grupo_detalle.controls.direccion.value);
      
      this.cliente.id_persona=this.form_zona_grupo_detalle.controls.lista_zona_seleccionados.value.id_persona;
      this.cliente.direccion=this.form_zona_grupo_detalle.controls.direccion.value;
     
       this.zona_servicio.post_cliente(this.cliente).subscribe(data=>{
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
    */
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
