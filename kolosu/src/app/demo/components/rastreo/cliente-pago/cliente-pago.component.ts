import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ApiService } from '../../servicios/api.service';
import { ActivatedRoute, ParamMap,Router } from '@angular/router';
import { PagoModelo } from '../../modelos/pago-modelo';
import { ServicioModelo } from '../../modelos/servicio-modelo';

@Component({
  selector: 'app-cliente-pago',
  templateUrl: './cliente-pago.component.html',
  styleUrls: ['./cliente-pago.component.scss'],
  providers: [MessageService]
})
export class ClientePagoComponent  implements OnInit{

  lista_pagos :Array<PagoModelo>=[];
  loading=false;
  columnas_pago = PagoModelo.columns; 
  toolbarButtons = new Array();
  id_cliente:number=0;

  constructor(
    private messageService: MessageService,
    private apiService: ApiService<PagoModelo>,
    private route: ActivatedRoute,
    private router: Router

  ) { }

  ngOnInit(): void {

    this.AgregarBotones();

    this.route.paramMap.subscribe((params: ParamMap) => {
      // console.log('Esto recibo desde url:', params.get('id_cliente'));
      this.id_cliente=Number(params.get('id_cliente'));
      this.ListaPagos();
    });
    PagoModelo.initialize(this.apiService,this.id_cliente);
    
  }
  ListaPagos() {

    this.loading=true;

    this.apiService.getAll('servicio/lista_pagos_cliente/'+this.id_cliente).subscribe({
      next: (data: PagoModelo[]) => {
        //console.log("lista de pagos",data);

        this.lista_pagos = JSON.parse(JSON.stringify(data)).lista_pagos_cliente;

      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        this.loading = false;
      }
    });

  }
  guardarClientePago(clientePago:PagoModelo){
    this.loading = true;
    
    clientePago.id_cliente=this.id_cliente;//setea el id_cliente para guardar el nuevo 
    //console.log("cliente pago",clientePago);
    
    this.apiService.create('servicio/post_pagos_cliente', clientePago).subscribe({
      next: (data: any) => {

        const mensaje = data?.mensaje?.[0];
  
        if (mensaje) {

          this.MensajeError(mensaje);

        } else {

          this.ListaPagos();
          
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
  eliminarClientePago(clientePago:PagoModelo){
    if (clientePago.id_pago_servicio) {
      this.loading = true;

      this.apiService.delete('servicio/eliminar_pagos_cliente', clientePago.id_pago_servicio).subscribe({
        next: () => {

          this.ListaPagos(); // Refresca la lista tras eliminar

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
