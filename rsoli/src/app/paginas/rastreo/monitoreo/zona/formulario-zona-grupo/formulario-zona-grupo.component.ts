
import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ZonaService } from '../zona.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ZonaGrupoModelo } from '../zona-grupo-model';
import Swal from'sweetalert2';

@Component({
  selector: 'app-formulario-zona-grupo',
  templateUrl: './formulario-zona-grupo.component.html',
  styleUrls: ['./formulario-zona-grupo.component.css']
})
export class FormularioZonaGrupoComponent implements OnInit {

  @Input() titulo: string = "";
  form_zona_grupo!: FormGroup;
  @Input() zona_grupo= new ZonaGrupoModelo();

  constructor(
    public bsModalRef: BsModalRef,
    private zona_grupo_servicio:ZonaService
  ) { }

  ngOnInit(): void {
    this.IniciarFormulario();
  }
  IniciarFormulario(){
    this.form_zona_grupo = new FormGroup({
      nombre_grupo: new FormControl(this.zona_grupo.nombre_grupo, [Validators.required,Validators.maxLength(50)]),
    });
  }
  GuardarZonaGrupo(){
    this.loading("Guardando datos");
    let nuevo_zona_grupo=new ZonaGrupoModelo();
    nuevo_zona_grupo.nombre_grupo=this.form_zona_grupo.value.nombre_grupo.trim();
    nuevo_zona_grupo.id_zona_grupo=this.zona_grupo.id_zona_grupo;
    
    this.zona_grupo_servicio.post_zona_grupo(nuevo_zona_grupo).subscribe(data=>{
      this.closeLoading();
      if(JSON.parse(JSON.stringify(data)).mensaje[0]){
        this.error('Error!!',JSON.parse(JSON.stringify(data)).mensaje[0]);
      }else{
        this.bsModalRef.hide();
      }
    },error=>{
      this.closeLoading();
      this.error("Error","Verifique su conexion a internet");
      console.log(error);
    });
  }
  loading(titulo:string){

    Swal.fire({
      title: titulo,
      html: 'Cargando',
      allowOutsideClick: false,
      didOpen: () => {
          Swal.showLoading()
      },
    }); 

  }
  closeLoading(){
    Swal.close();
  }
  error(titulo:string,mensaje:string){
    Swal.fire({
      icon: 'error',
      title: titulo,
      text: mensaje,
      didClose:() =>{
        
      }
    });
  }

}
