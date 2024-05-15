import { Component, Input, OnInit } from '@angular/core';
import { EntregaModelo } from '../entrega-modelo';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { EntregaService } from '../entrega.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { VehiculoModelo } from '../../../servicio/vehiculo/vehiculo-modelo';
import Swal from 'sweetalert2';
import { MessageService } from 'primeng/api';
import { ChoferModelo } from '../../chofer/chofer-modelo';

@Component({
  selector: 'app-modal-entrega',
  templateUrl: './modal-entrega.component.html',
  styleUrls: ['./modal-entrega.component.css'],
  providers: [MessageService]
})
export class ModalEntregaComponent implements OnInit {

  @Input() titulo: string = "";
  form_entrega!: FormGroup;
  @Input() entrega= new EntregaModelo();

  lista_vehiculo_seleccionados:VehiculoModelo = new VehiculoModelo();
  lista_vehiculo :Array<VehiculoModelo>=[];
  filtro_vehiculo!: any[];

  lista_chofer:Array<ChoferModelo>=[];
  lista_chofer_seleccionados:ChoferModelo = new ChoferModelo();


  constructor(
    public bsModalRef: BsModalRef,
    private entrega_servicio:EntregaService,
    private messageService: MessageService,
  ) { }

  ngOnInit(): void {
    this.IniciarFormulario();
    //this.IniciarListaVehiculo();
  }
  // IniciarListaVehiculo(){
  //   this.lista_vehiculo=JSON.parse(localStorage.getItem('accesos')|| '{}').Vehiculo;
  // }
  IniciarFormulario(){
    this.form_entrega = new FormGroup({
      fecha_inicio: new FormControl('', [Validators.required,Validators.maxLength(50)]),
      //fecha_fin: new FormControl('', [Validators.required,Validators.maxLength(50)]),
      //origen: new FormControl(this.entrega.origen, [Validators.required,Validators.maxLength(50)]),
      lista_vehiculo_seleccionados: new FormControl(this.lista_vehiculo_seleccionados, [Validators.required]),
      lista_chofer_seleccionados: new FormControl(this.lista_chofer_seleccionados, [Validators.required]),
    /*   apellido_paterno: new FormControl(this.entrega.apellido_paterno, [Validators.required, Validators.maxLength(20)]),
      apellido_materno: new FormControl(this.entrega.apellido_materno, [Validators.required, Validators.maxLength(20)]),
      numero_licencia: new FormControl(this.entrega.numero_licencia, [Validators.required, Validators.maxLength(10)]),
      categoria_licencia: new FormControl(this.entrega.categoria_licencia, [Validators.required, Validators.maxLength(10)]),
*/
    });
  }
  CargarValores(){
    
    this.loading_alert();
    
    this.entrega_servicio.get_entrega(this.entrega.id_entrega).subscribe(data=>{  
     
      console.log("valores ",JSON.parse(JSON.stringify(data)));

      this.closeLoading_alert();
      this.lista_vehiculo = JSON.parse(JSON.stringify(data)).lista_vehiculo;
      this.lista_chofer = JSON.parse(JSON.stringify(data)).lista_chofer;
      this.lista_vehiculo_seleccionados = new VehiculoModelo();
      this.lista_chofer_seleccionados = new ChoferModelo();


      console.log("lista vehiculos ",this.lista_vehiculo);
      console.log("lista chofer ",this.lista_chofer);
      
      /*if(this.zona_grupo_detalle_modelo.id_zona_grupo_detalle!=0){
        console.log("ver ",data);
        //this.zona_grupo_detalle_modelo=JSON.parse(JSON.stringify(data)).cliente[0];
        //this.zona_grupo_detalle_modelo.direccion=JSON.parse(JSON.stringify(data)).cliente[0].direccion;
        this.lista_zona_seleccionados=JSON.parse(JSON.stringify(data)).lista_zonas_seleecionado[0];
      }else{

        //this.zona_grupo_detalle_modelo.direccion="";
        this.lista_zona_seleccionados = new ZonaModelo();
      }*/
      this.IniciarFormulario();

    },
    error=>{
        this.closeLoading_alert();
        //this.closeLoading_alert("Error","Verifique su conexion internet");
    })

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

  GuardarEntrega(){
    this.loading_alert();

    console.log("id_vehiculo",this.form_entrega.controls.lista_vehiculo_seleccionados.value.id_vehiculo);
    console.log("fecha_inicio ",this.form_entrega.controls.fecha_inicio.value);
    console.log("id_chofer ",this.form_entrega.controls.lista_chofer_seleccionados.value.id_chofer);
    let id_vehiculo =this.form_entrega.controls.lista_vehiculo_seleccionados.value.id_vehiculo;
    let id_chofer = this.form_entrega.controls.lista_chofer_seleccionados.value.id_chofer
    let fecha_inicio = this.form_entrega.controls.fecha_inicio.value;
    this.entrega_servicio.post_entrega({id_vehiculo:id_vehiculo,id_chofer:id_chofer,fecha_ini:fecha_inicio }).subscribe(data=>{
   
      this.closeLoading_alert();
      
      console.log("ver res ",data);
    })
    

  }

}
