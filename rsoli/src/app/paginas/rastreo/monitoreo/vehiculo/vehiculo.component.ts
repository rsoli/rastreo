import { Component, OnInit } from '@angular/core';
import { VehiculoModelo } from '../../servicio/vehiculo/vehiculo-modelo';
import { VehiculoService } from '../../servicio/vehiculo/vehiculo.service';
import { MessageService } from 'primeng/api';
import Swal from 'sweetalert2';
import { Router} from '@angular/router';

@Component({
  selector: 'app-vehiculo',
  templateUrl: './vehiculo.component.html',
  styleUrls: ['./vehiculo.component.css'],
  providers: [MessageService]
})
export class VehiculoComponent implements OnInit {

  loading: boolean = true;
  lista_vehiculos :Array<VehiculoModelo>=[];
  vehiculo_seleccionado=new VehiculoModelo();

  constructor(
    private monitoreo_servicio:VehiculoService,
    private router: Router,
    private messageService: MessageService,
  ) { }

  ngOnInit(): void {
    this.GetVehiculoss();
  }
  GetVehiculoss(){
		this.monitoreo_servicio.get_vehiculos_usuario().subscribe(data=>{
			this.loading = false;
			this.lista_vehiculos=JSON.parse(JSON.stringify(data)).vehiculo;
			console.log("ver res ",	this.lista_vehiculos);
		  })
  }
	SeleccionarGeocerca(lista_vehiculos:VehiculoModelo){
		this.BorrarToast();
		this.vehiculo_seleccionado=lista_vehiculos;
		this.messageService.add({severity: 'info', summary: 'Vehículo seleccionado', detail: (this.vehiculo_seleccionado.placa).toString() });
	}
	FormularioVehiculo(id:number){

		this.BorrarToast();


		
		// if(id==0){
		//   let nuevo_geocerca =new VehiculoModelo();

		//   this.router.navigate(['/rastreo/formulario_geocerca'],  
		//   { queryParams: 
		// 	  { 
		// 		  id: 0 , 
		// 		  nombre_geocerca:nuevo_geocerca.nombre_geocerca ,
		// 		  area:nuevo_geocerca.area ,
		// 		  descripcion:nuevo_geocerca.descripcion ,
		// 		  tipo_geocerca:nuevo_geocerca.tipo_geocerca,
		// 		  titulo_formulario:'Nuevo geocerca'
		// 	  } 
		//   } ); 
		 
		// }else{
		//    if(this.vehiculo_seleccionado.id==0){
		//  	this.messageService.add({severity:'warn', summary: 'Alerta', detail: 'Seleccione un geocerca para editar'});
		//    }else{
		// 	 this.router.navigate(['/rastreo/formulario_geocerca'],  
		// 	 { queryParams: 
		// 		 { 
		// 			 id: this.vehiculo_seleccionado.id , 
		// 			 nombre_geocerca:this.vehiculo_seleccionado.nombre_geocerca ,
		// 			 area:this.vehiculo_seleccionado.area ,
		// 			 descripcion:this.vehiculo_seleccionado.descripcion ,
		// 			 tipo_geocerca:this.vehiculo_seleccionado.tipo_geocerca,
		// 			 titulo_formulario:'Editar geocerca'
		// 		 } 
		// 	 } ); 
			
		//    }
	
		// }
		
	
	}
	EliminarVehiculo(){
		this.BorrarToast();
		/*if(this.vehiculo_seleccionado.id_vehiculo){
	
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
				this.monitoreo_servicio.eliminar_geocerca(this.vehiculo_seleccionado.id).subscribe(data=>{
				  this.closeLoading_alert();
				  this.GetVehiculoss();
				})
			  }
			})
	
		}else{  
		  this.messageService.add({severity:'warn', summary: 'Alerta', detail: 'Seleccione un geocerca para eliminar'});
		}*/
	}
	BorrarToast() {
		this.messageService.clear();
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

}
