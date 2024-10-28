import { Component, OnInit } from '@angular/core';
import { ServicioModelo } from '../../modelos/servicio-modelo';
import { MessageService } from 'primeng/api';
// import { PersonasService } from '../../servicios/personas.service';
import { ApiService } from '../../servicios/api.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cliente-servicio',
  templateUrl: './cliente-servicio.component.html',
  styleUrls: ['./cliente-servicio.component.scss'],
  providers: [MessageService]
})
export class ClienteServicioComponent implements OnInit{

  lista_servicios :Array<ServicioModelo>=[];
  loading=false;
  columnas_servicio = ServicioModelo.columns; 
  toolbarButtons = new Array();
  id_cliente:number=0;

  constructor(
    private messageService: MessageService,
    private apiService: ApiService<ServicioModelo>,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {

    this.AgregarBotones();

    ServicioModelo.initialize(this.apiService);

    this.route.paramMap.subscribe((params: ParamMap) => {
      // console.log('Esto recibo desde url:', params.get('id_cliente'));
      this.id_cliente=Number(params.get('id_cliente'));
      this.ListarServicios();
    });
    
  }
  ListarServicios() {

    this.loading=true;

    this.apiService.getAll('servicio/lista_servicio_cliente/'+this.id_cliente).subscribe({
      next: (data: ServicioModelo[]) => {
      console.log(data);

        this.lista_servicios = JSON.parse(JSON.stringify(data)).lista_servicios_cliente;

      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        this.loading = false;
      }
    });

  }
  guardarClienteServicio(clienteServicio: ServicioModelo) { 

    this.loading = true;
    
    clienteServicio.id_cliente=this.id_cliente;//setea el id_cliente para guardar el nuevo servicio
    
    this.apiService.create('servicio/post_servicio', clienteServicio).subscribe({
      next: (data: any) => {

        const mensaje = data?.mensaje?.[0];
  
        if (mensaje) {

          this.MensajeError(mensaje);

        } else {

          this.ListarServicios();
          
        }
      },
      error: (error) => {
        this.MensajeError("Verifique su conexión a internet");
        console.log(error);
      },
      complete: () => {
        this.loading = false;
      }
    });

  }
  eliminarClienteServicio(clienteServicio: ServicioModelo) {

    if (clienteServicio.id_servicio) {
      this.loading = true;

      this.apiService.delete('servicio/eliminar_servicio', clienteServicio.id_servicio).subscribe({
        next: () => {

          this.ListarServicios(); // Refresca la lista tras eliminar

        },
        error: (error) => {

          console.log('Error al eliminar:', error);
          this.MensajeError("Error al eliminar");

        },
        complete: () => {

          this.loading = false;

        }
      });
    }

  }
  seleccionarServicio(clienteServicio: ServicioModelo) {
    this.messageService.clear();
    this.MensajeInfo("Servicio "+clienteServicio.tipo_servicio,true);
  }

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

  MensajeError(mensaje:string){

    
    this.messageService.add({severity:'error', summary: 'Error', detail: mensaje});

  }
  MensajeSucces(mensaje:string){

    this.messageService.add({severity:'success', summary: 'Exito', detail: mensaje});

  }
  MensajeInfo(mensaje:string,seleccion:boolean){
    if(seleccion==true){
      this.messageService.add({severity:'info', summary: 'Seleccionado', detail: mensaje});
    }else{
      this.messageService.add({severity:'info', summary: 'Información', detail: mensaje});
    }


  }
  MensajeAdvertencia(mensaje:string){

    this.messageService.add({severity:'error', summary: 'Error', detail: mensaje});

  }
  ButtonEnabled(name: string, disabled: boolean): void {
    this.toolbarButtons.forEach(btn => {
      if (btn.name === name) {
        btn.disabled = disabled;
      }
    });
  }
}
