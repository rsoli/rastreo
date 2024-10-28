
import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ApiService } from '../../servicios/api.service';
import { DispositivoModelo } from '../../modelos/dispositivo-modelo';
import { Router } from '@angular/router';
import { TraccarService } from '../../servicios/traccar.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ConfirmationService } from 'primeng/api';


@Component({
  selector: 'app-dispositivo',
  templateUrl: './dispositivo.component.html',
  styleUrls: ['./dispositivo.component.css'],
  providers: [MessageService,ConfirmationService]
})
export class DispositivoComponent implements OnInit {

  loading = false;
  lista_dispositivo : Array<DispositivoModelo> = [];
  columnas_dispositivo = DispositivoModelo.columns;
  columns_geocerca= DispositivoModelo.columns_geocerca;
  toolbarButtons = new Array();
  modal_geocerca:boolean=false;
  selectedGeocerca:any={};
  private token!: string;

  constructor(
    private apiService: ApiService<DispositivoModelo>, 
    private messageService: MessageService, 
    private router: Router,
    private traccar:TraccarService,
    private confirmationService: ConfirmationService
  ) { }

  async ngOnInit(): Promise<void> {

    this.token = await this.getToken();
    if (this.token) {

      this.traccar.post_iniciar_sesion(this.token).subscribe({
        next: () => {

          this.ListarDispositivo();
          DispositivoModelo.initialize(this.apiService);
          this.AgregarBotones();
        },
        error: (error) => {
            // Verificar si el error es por falta de conexión
            if (this.isConnectionError(error)) {
              console.log("ERROR AL INICIAR SESIÓN: No hay conexión a Internet"); //tambein controla el servicio interceptor
            } else {
              // Aquí puedes decidir si quieres borrar el token o no
              localStorage.removeItem("accesos");
              this.router.navigate(['/auth/login']);
            }

            this.loading=false;
        }
      });



    } else {

      this.loading=false;
      localStorage.removeItem("accesos");
      this.router.navigate(['/auth/login']); 

    }
    

  }
  private isConnectionError(error: any): boolean {
    return !navigator.onLine || error.status === 0; // Puedes personalizar esta lógica
  }
  private async getToken(): Promise<string> {
    return JSON.parse(localStorage.getItem('accesos') || '{}').token_socket || '';
  }
  cerrarModalFiltro(){
    this.modal_geocerca=false;
  }
  aplicarFiltro(data: any){
    console.log("Parmetros recibidos", data);
    this.loading=true;
    this.modal_geocerca=false;
    this.apiService.create('servicio/post_geocercas_dispositivo', data).subscribe({
      next: (data: any) => {
        const mensaje = data?.mensaje?.[0];
        if (mensaje) {
          this.MensajeError(mensaje);
        } else {
          this.ListarDispositivo();
        }
      },
      error: (error) => {
        this.MensajeError("Verifique su conexion a internet");
      },
      complete: () => {
        
        this.modal_geocerca=false;
      }
    });
    
  }
  ListarDispositivo() {
    this.loading = true;
  
    this.apiService.getAll('vehiculo/lista_dispositivos').subscribe({
      next: (data: any) => {
        // console.log("dispositivos", data);
  
        // Parseamos la lista de dispositivos directamente
        this.lista_dispositivo = data.lista_dispositivos;
      },
      error: (error) => {
        this.MensajeError("Error al obtener la lista");
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
  

  guardarDispositivo(dispositivo: DispositivoModelo) {

    console.log("hola ",dispositivo);
    
    /*this.loading = true;

    this.apiService.create('dispositivo/post_dispositivo', dispositivo).subscribe({
      next: (data: any) => {
        const mensaje = data?.mensaje?.[0];
        if (mensaje) {
          this.MensajeError(mensaje);
        } else {
          this.ListarDispositivo();
        }
      },
      error: (error) => {
        this.MensajeError("Verifique su conexi�n a internet");
      },
      complete: () => {
        this.loading = false;
      }
    });*/
  }

  

  seleccionarDispositivo(dispositivo: DispositivoModelo) {
    this.messageService.clear();
    this.MensajeInfo(dispositivo.placa,true);
   
    const data = dispositivo.id_geocercas;
  
    // Convertir cada objeto en una cadena JSON y formar un nuevo array
  
    //la placa selectedGeocerca se utiliza para aprovechas y mostrarle en el titulo del modal
    this.selectedGeocerca={id_vehiculo:dispositivo.id_vehiculo,id_geocercas: JSON.parse(dispositivo.id_geocercas),id_notificaciones:JSON.parse(dispositivo.id_notificaciones),placa:dispositivo.placa};  

    this.ButtonEnabled('btnGeocerca', false);
    this.ButtonEnabled('btnBloqueo', false);
    this.ButtonEnabled('btnDesbloqueo', false);
  }

  deshacerSeleccionDispositivo(dispositivo: DispositivoModelo) {
    this.ButtonEnabled('btnGeocerca', true);
    this.ButtonEnabled('btnBloqueo', true);
    this.ButtonEnabled('btnDesbloqueo', true);
  }

  AgregarBotones() {
    this.toolbarButtons.push({
      name: "btnGeocerca",
      label: 'Geocercas',
      tooltip: 'Asignar Geocerca',
      action: 'onGeocerca',
      icon: 'pi pi-map',
      disabled: true,
      class: 'p-button-rounded p-button-info'
    });
    this.toolbarButtons.push(
      { name:"btnBloqueo", 
        label: 'Desactivar motor', 
        tooltip: 'Desactivar motor',
        action: 'onBloqueo', 
        icon: 'pi pi-lock',
        disabled:true,
        class:'p-button-rounded p-button-danger'
      }); 
    this.toolbarButtons.push(
      { name:"btnDesbloqueo", 
        label: 'Activar motor', 
        tooltip: 'Activar motor',
        action: 'onDesbloqueo', 
        icon: 'pi pi-lock-open',
        disabled:true,
        class:'p-button-rounded p-button-success'
        }); 
      
  }

  ButtonClick(event: { action: string, rowData: any }) {

    const { action, rowData } = event;
       
    // console.log("ver id_Device",rowData.id_dispositivo);
    let comando:string;
    let deviceId:number;
    
    if (action === 'onGeocerca') {

        this.modal_geocerca=true;
    } 
    else if (action === 'onBloqueo') {

      comando=rowData.desactivar_motor?rowData.desactivar_motor.trim():'';
      deviceId = rowData.id_dispositivo;

      //this.enviarComando(comando,deviceId);

      this.confirmationService.confirm({
        message: '¿Estás seguro de desactivar el motor?',
        header: 'Dispositivo '+this.selectedGeocerca.placa,
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Sí',  // Texto del botón "Sí"
        rejectLabel: 'No',   // Texto del botón "No"
        accept: () => {
          this.enviarComando(comando, deviceId);
        },
        reject: () => {
          // this.cancelarComando();
        }
      });
        
    } 
    else if (action === 'onDesbloqueo') {
      
      comando=rowData.activar_motor?rowData.activar_motor.trim():'';
      deviceId = rowData.id_dispositivo;

      //this.enviarComando(comando,deviceId);

      this.confirmationService.confirm({
        message: '¿Estás seguro de activar el motor?',
        header: 'Dispositivo '+this.selectedGeocerca.placa,
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Sí',  // Texto del botón "Sí"
        rejectLabel: 'No',   // Texto del botón "No"
        accept: () => {
          this.enviarComando(comando, deviceId);
        },
        reject: () => {
          // this.cancelarComando();
        }
      });
      
    } 
    else {
        console.error('Acción no soportada');
    }

  }
  enviarComando(comando: string, id_dispositivo: number) {

    if(comando?.trim()==''){

      this.MensajeError("El dispositivo no está configurado para la operación.");

      return;
    }
    const deviceId = id_dispositivo;  // El ID del dispositivo que quieres controlar
    const command = comando; // El comando que deseas enviar
    this.loading=true;
    this.traccar.enviarComandoPersonalizado(deviceId, command).subscribe({
      next: async (response) => {
        //console.log('Comando enviado correctamente:', response);
        await this.sleep(10000); 
        this.historialComando(deviceId,comando,);
        // Aquí puedes manejar la respuesta cuando el comando se haya enviado exitosamente
      },
      error: (error: HttpErrorResponse) => {
        //console.error('Error al enviar el comando:', error);
        this.MensajeError("Error al enviar el comando");
        this.loading=false; 
        // Aquí puedes manejar el error si no se ha enviado el comando
      },
      complete: () => {
        //console.log('Petición completada.');
        //this.loading=false;  //no se usa por el sleep
      }
    });
  }
  historialComando(id_dispositivo: number,comando: string){


    let dispositivo=new DispositivoModelo();
    dispositivo.device_id=id_dispositivo;
    dispositivo.command=comando;
    this.loading=true;

    this.apiService.create('vehiculo/post_enviarComando', dispositivo).subscribe({
      next: (data: any) => {

        const mensaje = data?.mensaje?.[0];
  
        if (mensaje) {

          this.MensajeError(mensaje);

        } else {

          
          this.ListarDispositivo();
          this.MensajeSucces("Comando enviado");
          
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
  sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  MensajeError(mensaje: string) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: mensaje });
  }

  MensajeSucces(mensaje: string) {
    this.messageService.add({ severity: 'success', summary: 'Exito', detail: mensaje });
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
