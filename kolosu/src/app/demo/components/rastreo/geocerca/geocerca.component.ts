
import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ApiService } from '../../servicios/api.service';
import { GeocercaModelo } from '../../modelos/geocerca-modelo';
import { Router } from '@angular/router';

@Component({
  selector: 'app-geocerca',
  templateUrl: './geocerca.component.html',
  styleUrls: ['./geocerca.component.css'],
  providers: [MessageService]
})
export class GeocercaComponent implements OnInit {

  loading = false;
  lista_geocerca : Array<GeocercaModelo> = [];
  columnas_geocerca = GeocercaModelo.columns;
  toolbarButtons = new Array();

  constructor(private apiService: ApiService<GeocercaModelo>, private messageService: MessageService, private router: Router) { }

  ngOnInit(): void {

    this.ListarGeocerca();
    GeocercaModelo.initialize(this.apiService);
    
  }

  ListarGeocerca() {
    this.loading = true;

    this.apiService.getAll('servicio/lista_geocercas').subscribe({
      next: (data: GeocercaModelo[]) => {
        // console.log(data);
        
        this.lista_geocerca = JSON.parse(JSON.stringify(data)).lista_geocercas;
      },
      error: (error) => {
        this.MensajeError("Error al obtener la lista");
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  guardarGeocerca(geocerca: GeocercaModelo) {

    this.loading = true;

    geocerca.tipo_geocerca= JSON.parse(JSON.stringify(geocerca.area)).tipo_geocerca;
    geocerca.area=JSON.parse(JSON.stringify(geocerca.area)).area;

    // console.log("datos form ",geocerca);
    
    this.apiService.create('servicio/post_geocerca', geocerca).subscribe({
      next: (data: any) => {
        const mensaje = data?.mensaje?.[0];
        if (mensaje) {
          this.MensajeError(mensaje);
        } else {
          this.ListarGeocerca();
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

  eliminarGeocerca(geocerca: GeocercaModelo) {
    if (geocerca.id) {
      this.loading = true;

      this.apiService.delete('servicio/eliminar_geocerca', geocerca.id).subscribe({
        next: () => {
          this.ListarGeocerca();
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

  seleccionarGeocerca(geocerca: GeocercaModelo) {
    this.messageService.clear();
    this.MensajeInfo(geocerca.nombre_geocerca,true);
  }

  deshacerSeleccionGeocerca(geocerca: GeocercaModelo) { }


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
