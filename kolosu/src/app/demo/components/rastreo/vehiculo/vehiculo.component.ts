
import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ApiService } from '../../servicios/api.service';
import { VehiculoModelo } from '../../modelos/vehiculo-modelo';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

@Component({
  selector: 'app-vehiculo',
  templateUrl: './vehiculo.component.html',
  styleUrls: ['./vehiculo.component.css'],
  providers: [MessageService]
})
export class VehiculoComponent implements OnInit {

  loading = false;
  lista_vehiculo : Array<VehiculoModelo> = [];
  columnas_vehiculo = VehiculoModelo.columns;
  toolbarButtons = new Array();
  id_cliente:number=0;

  constructor(
    private apiService: ApiService<VehiculoModelo>, 
    private messageService: MessageService, 
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    
    this.AgregarBotones();

    this.route.paramMap.subscribe((params: ParamMap) => {
      // console.log('Esto recibo desde url:', params.get('id_cliente'));
      this.id_cliente=Number(params.get('id_cliente'));
      this.ListarVehiculo();
      VehiculoModelo.initialize(this.apiService,this.id_cliente);
      
    });
    
  }

  ListarVehiculo() {
    this.loading = true;
    
    this.apiService.getAll('vehiculo/lista_cliente_vehiculos/'+this.id_cliente).subscribe({
      next: (data: VehiculoModelo[]) => {
        //console.log(data);
        
        this.lista_vehiculo = JSON.parse(JSON.stringify(data)).lista_cliente_vehiculos;
      },
      error: (error) => {
        this.MensajeError("Error al obtener la lista");
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  guardarVehiculo(vehiculo: VehiculoModelo) {
    this.loading = true;
    vehiculo.id_cliente=this.id_cliente;
    //console.log("vehic",vehiculo);

    
    this.apiService.create('vehiculo/post_cliente_vehiculo', vehiculo).subscribe({
      next: (data: any) => {
        const mensaje = data?.mensaje?.[0];
        if (mensaje) {
          this.MensajeError(mensaje);
        } else {
          this.ListarVehiculo();
        }
      },
      error: (error) => {
        this.MensajeError("Verifique su conexi�n a internet");
      },
      complete: () => {
        this.loading = false;
      }
    });
    
  }

  eliminarVehiculo(vehiculo: VehiculoModelo) {
    if (vehiculo.id_vehiculo) {
      this.loading = true;

      this.apiService.delete('vehiculo/eliminar_vehiculo', vehiculo.id_vehiculo).subscribe({
        next: () => {
          this.ListarVehiculo();
        },
        error: (error) => {
          this.MensajeError("Error al eliminar");
        },
        complete: () => {
          this.loading = false;
        }
      });
    }
  }

  seleccionarVehiculo(vehiculo: VehiculoModelo) {
    this.messageService.clear();
    this.MensajeInfo("Vehículo "+vehiculo.placa,true);
  }

  deshacerSeleccionVehiculo(vehiculo: VehiculoModelo) { }

  AgregarBotones() {
    
    this.toolbarButtons.push({
      name: "btnAtras",
      label: 'Volver',
      action: 'volveratras',
      icon: 'pi pi-arrow-left',
      disabled: true,
      class: 'p-button-rounded p-button-info'
    });
    this.ButtonEnabled('btnAtras', false);
    
  }

  ButtonClick(event: { action: string, rowData: any }) {
    
    const { action, rowData } = event;

    if (action === 'volveratras') {
      this.router.navigate(['/rastreo/lista_cliente']);
    } 
    else if (action === 'onPruba2') {
        // L�gica para 'onPruba2'
    } 
    else {
        console.error('Accion no soportada');
    }

  }

  MensajeError(mensaje: string) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: mensaje });
  }

  MensajeSucces(mensaje: string) {
    this.messageService.add({ severity: 'success', summary: '�xito', detail: mensaje });
  }

  MensajeInfo(mensaje:string,seleccion:boolean){
  
    if(seleccion==true){
      this.messageService.add({severity:'info', summary: 'Seleccionado', detail: mensaje});
    }else{
      this.messageService.add({severity:'info', summary: 'Informaci�n', detail: mensaje});
    }

  }

  ButtonEnabled(name: string, disabled: boolean): void {
    this.toolbarButtons.forEach(btn => {
      if (btn.name === name) {
        btn.disabled = disabled;
      }
    });
  }
}
