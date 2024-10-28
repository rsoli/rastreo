import { Component,OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ApiService } from '../../servicios/api.service';
import { clienteModelo } from '../../modelos/cliente-modelo';
import { Router } from '@angular/router';


@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.scss'],
  providers: [MessageService]
})
export class ClienteComponent implements OnInit{
  loading=false;
  lista_clientes :Array<clienteModelo>=[];
  columnas_cliente = clienteModelo.columns; 
  toolbarButtons=new Array();
  es_admin:boolean=false;

  constructor(
    private messageService: MessageService,
    private apiService: ApiService<clienteModelo>,
    private router: Router
  ) { }

  ngOnInit(): void {

    this.ListarClientes();
    clienteModelo.initialize(this.apiService);
    this.AgregarBotones();
    this.verSession();

  }
  verSession(){
    console.log("ver session",JSON.parse(localStorage.getItem('accesos') || '{}'));
    
    this.es_admin = (JSON.parse(localStorage.getItem('accesos') || '{}').sesion)==true?false:true;
  }
  ListarClientes() {
    this.loading=true;

    this.apiService.getAll('cliente/lista_clientes').subscribe({
      next: (data: clienteModelo[]) => {
        console.log(data);
        
        this.lista_clientes = JSON.parse(JSON.stringify(data)).lista_clientes;

      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
  guardarCliente(cliente:clienteModelo){
    this.loading = true;
    cliente.id_persona =JSON.parse(JSON.stringify(cliente)).id_persona.value;

    this.apiService.create('cliente/post_cliente', cliente).subscribe({
      next: (data: any) => {

        const mensaje = data?.mensaje?.[0];
  
        if (mensaje) {

          this.MensajeError(mensaje);

        } else {

          this.ListarClientes();
          
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
  eliminarCliente(cliente:clienteModelo){
    
    if (cliente.id_cliente) {
      this.loading = true;

      this.apiService.delete('cliente/eliminar_cliente', cliente.id_cliente).subscribe({
        next: () => {

          this.ListarClientes(); // Refresca la lista tras eliminar

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
  seleccionarCliente(cliente:clienteModelo){
    this.messageService.clear();
    this.MensajeInfo(cliente.persona,true);
    this.ButtonEnabled('btnVehiculo', false);
    //
    this.ButtonEnabled('btnServicio', false);
    this.ButtonEnabled('btnPago', false);
  }
  deshacerSeleccionCliente(cliente:clienteModelo){
    this.ButtonEnabled('btnVehiculo', true);
    //
    this.ButtonEnabled('btnServicio', true);
    this.ButtonEnabled('btnPago', true);
  }
  AgregarBotones(){

    this.toolbarButtons.push(
      { name:"btnVehiculo", 
        label: 'Vehículos', 
        action: 'onVeiculos', 
        icon: 'pi pi-car',
        disabled:true,
        class:'p-button-rounded p-button-info'
      });  

    this.toolbarButtons.push(
      { name:"btnServicio", 
        label: 'Servicios', 
        action: 'onServicios', 
        icon: 'pi pi-link',
        disabled:true,
        class:'p-button-rounded p-button-warning'
      });  
      
    this.toolbarButtons.push(
        { name:"btnPago", 
          label: 'Pagos', 
          action: 'onPagos', 
          icon: 'pi pi-dollar',
          disabled:true,
          class:'p-button-rounded p-button-success'
      });  

  }
  ButtonClick(event: { action: string, rowData: any }) {

    const { action, rowData } = event;
  
    if (action === 'onVeiculos') {
      this.router.navigate(['/rastreo/lista_cliente_vehiculo', rowData.id_cliente]);
    } 
    else if (action === 'onServicios') {
      this.router.navigate(['/rastreo/lista_cliente_servicio', rowData.id_cliente]);
    } 
    else if (action === 'onPagos') {
      this.router.navigate(['/rastreo/lista_cliente_pago', rowData.id_cliente]);
    } 
    else {
      console.error('Acción no soportada');
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
