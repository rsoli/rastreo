import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import Swal from'sweetalert2';
// import { VehiculoService } from '../../servicio/vehiculo/vehiculo.service';
import { MonitoreoService } from '../monitoreo.service';
import { GeocercaModelo } from '../geocerca-model';

@Component({
  selector: 'app-vehiculo-geocerca',
  templateUrl: './vehiculo-geocerca.component.html',
  styleUrls: ['./vehiculo-geocerca.component.css']
})
export class VehiculoGeocercaComponent implements OnInit {

  @Input() titulo: string = "";
  form_geocerca!: FormGroup;

  lista_geocercas :Array<GeocercaModelo>=[];
  lista_geocercas_seleccionados: string[] = [];
  // lista_geocercas_seleccionados :Array<GeocercaModelo>=[];

  

  lista_notificacion :Array<string>=[];
  lista_notificacion_seleccionados :Array<string>=[];

  constructor(
    public bsModalRef: BsModalRef,
    private monitoreo_servicio:MonitoreoService,

  ) { }

  ngOnInit(): void {
    this.GetGeocercas();
    this.IniciarFormulario();
  }
  GuardarGeocerca(){
    console.log("geocercas ",this.form_geocerca.controls.lista_geocercas_seleccionados.value );
    console.log("notificaciones ",this.form_geocerca.controls.lista_notificacion_seleccionados.value);

    var geocerca=this.form_geocerca.controls.lista_geocercas_seleccionados.value ;
    var notificacion=this.form_geocerca.controls.lista_notificacion_seleccionados.value;

    this.monitoreo_servicio.post_geocerca_notificacion([{geocercas:geocerca,notificaciones:notificacion }]).subscribe(data=>{
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
	GetGeocercas(){
    this.loading();
		this.monitoreo_servicio.get_geocercas().subscribe(data=>{
			this.close();
			this.lista_geocercas=JSON.parse(JSON.stringify(data)).lista_geocercas;
      this.lista_notificacion=JSON.parse(JSON.stringify(data)).lista_notificacion ;
			console.log("ver res ",this.lista_notificacion );
		  },
      error=>{
        console.log("ver errores ",error);
      })
	}
  IniciarFormulario(){

    this.form_geocerca = new FormGroup({
      // usuario: new FormControl(this.usuario.usuario, [Validators.required,Validators.maxLength(20)]),
      // contrasena: new FormControl(this.usuario.password, [Validators.required,Validators.minLength(8),Validators.maxLength(50)]),
      // repetir_contrasena: new FormControl('', [Validators.required,Validators.minLength(8),Validators.maxLength(50)]),
      // email: new FormControl(this.usuario.email, [Validators.required,Validators.maxLength(50),Validators.email]),
      lista_geocercas_seleccionados: new FormControl(this.lista_geocercas_seleccionados, [Validators.required]),
      lista_notificacion_seleccionados: new FormControl(this.lista_notificacion_seleccionados, [Validators.required]),
    }); 

    // if(this.usuario.id_usuario==0){
    //   this.form_usuario = new FormGroup({
    //     usuario: new FormControl(this.usuario.usuario, [Validators.required,Validators.maxLength(20)]),
    //     contrasena: new FormControl(this.usuario.password, [Validators.required,Validators.minLength(8),Validators.maxLength(50)]),
    //     repetir_contrasena: new FormControl('', [Validators.required,Validators.minLength(8),Validators.maxLength(50)]),
    //     email: new FormControl(this.usuario.email, [Validators.required,Validators.maxLength(50),Validators.email]),
    //     lista_personas_seleccionados: new FormControl(this.lista_personas_seleccionados, [Validators.required]),
    //     lista_roles_seleccionados: new FormControl(this.lista_roles_seleccionados, [Validators.required]),
    //   }); 
    // }else{
    //   this.form_usuario = new FormGroup({
    //     usuario: new FormControl(this.usuario.usuario, [Validators.required,Validators.maxLength(20)]),
    //     contrasena: new FormControl('', [Validators.maxLength(50)]),
    //     repetir_contrasena: new FormControl('', [Validators.maxLength(50)]),
    //     email: new FormControl(this.usuario.email, [Validators.required,Validators.maxLength(50),Validators.email]),
    //     lista_personas_seleccionados: new FormControl(this.lista_personas_seleccionados, [Validators.required]),
    //     lista_roles_seleccionados: new FormControl(this.lista_roles_seleccionados, [Validators.required]),
    //   }); 
    // }

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
