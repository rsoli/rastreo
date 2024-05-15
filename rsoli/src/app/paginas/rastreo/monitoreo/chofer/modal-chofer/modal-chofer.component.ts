import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ChoferModelo } from '../chofer-modelo';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ChoferService } from '../chofer.service';
import Swal from'sweetalert2';

@Component({
  selector: 'app-modal-chofer',
  templateUrl: './modal-chofer.component.html',
  styleUrls: ['./modal-chofer.component.css']
})
export class ModalChoferComponent implements OnInit {

  
  @Input() titulo: string = "";
  form_chofer!: FormGroup;
  @Input() chofer= new ChoferModelo();
  
  constructor(
    public bsModalRef: BsModalRef,
    private chofer_servicio:ChoferService
  ) { }

  ngOnInit(): void {
    this.IniciarFormulario();
  }
  IniciarFormulario(){
    this.form_chofer = new FormGroup({
      nombre: new FormControl(this.chofer.nombre, [Validators.required,Validators.maxLength(20)]),
      apellido_paterno: new FormControl(this.chofer.apellido_paterno, [Validators.required, Validators.maxLength(20)]),
      apellido_materno: new FormControl(this.chofer.apellido_materno, [Validators.required, Validators.maxLength(20)]),
      numero_licencia: new FormControl(this.chofer.numero_licencia, [Validators.required, Validators.maxLength(10)]),
      categoria_licencia: new FormControl(this.chofer.categoria_licencia, [Validators.required, Validators.maxLength(10)]),

    });
  }
  GuardarChofer(){
    this.loading("Guardando datos");
    let nuevo_chofer=new ChoferModelo();
    nuevo_chofer.nombre=this.form_chofer.value.nombre.trim();
    nuevo_chofer.apellido_paterno=this.form_chofer.value.apellido_paterno.trim();
    nuevo_chofer.apellido_materno=this.form_chofer.value.apellido_materno.trim();
    nuevo_chofer.numero_licencia=this.form_chofer.value.numero_licencia.trim();
    nuevo_chofer.categoria_licencia=this.form_chofer.value.categoria_licencia.trim();
    nuevo_chofer.id_chofer = this.chofer.id_chofer;
    
    this.chofer_servicio.post_chofer(nuevo_chofer).subscribe(data=>{
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
