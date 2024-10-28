import { Component, OnInit, ViewChild } from '@angular/core';
//import { PersonasService } from '../../servicios/personas.service';
import { PersonaModelo } from '../../modelos/persona-modelo';
import {MessageService} from 'primeng/api';
import { PrimeNGConfig } from 'primeng/api';
import { ApiService } from '../../servicios/api.service';

@Component({
  selector: 'app-persona',
  templateUrl: './persona.component.html',
  styleUrls: ['./persona.component.scss'],
  providers: [MessageService]
})
export class PersonaComponent implements OnInit{

  lista_personas :Array<PersonaModelo>=[];
  loading=false;
  columnas_persona = PersonaModelo.columns; 
  es_admin:boolean=false;

  constructor(
    private apiService: ApiService<PersonaModelo>, 
    private messageService: MessageService
  ) { }


  
  ngOnInit(): void {

    this.ListarPersonas();
    this.verSession();
  }
  verSession(){
    // console.log("ver session",JSON.parse(localStorage.getItem('accesos') || '{}'));
    
    this.es_admin = (JSON.parse(localStorage.getItem('accesos') || '{}').sesion)==true?false:true;
  }

  ListarPersonas() {

      this.loading=true;

      this.apiService.getAll('persona/lista_persona').subscribe({
        next: (data: PersonaModelo[]) => {
          console.log(data);
          
          this.lista_personas = JSON.parse(JSON.stringify(data)).personas;
  
        },
        error: (error) => {
          console.log(error);
        },
        complete: () => {
          this.loading = false;
        }
      });

  }
  eliminarPersona(persona: PersonaModelo): void {
    
    if (persona.id_persona) {
      this.loading = true;

      this.apiService.delete('persona/eliminar_persona',persona.id_persona).subscribe({
        next: () => {

          this.ListarPersonas(); // Refresca la lista tras eliminar

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

  guardarPersona(persona: PersonaModelo): void {
    
     this.loading = true;

    this.apiService.create('persona/post_persona', persona).subscribe({
      next: (data: any) => {

        const mensaje = data?.mensaje?.[0];
  
        if (mensaje) {

          this.MensajeError(mensaje);

        } else {

          this.ListarPersonas();
          
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
  seleccionarPersona(persona: PersonaModelo){
    this.messageService.clear();
    this.MensajeInfo(persona.nombre+' '+persona.apellido_paterno+' '+persona.apellido_materno,true);
    //this.ButtonEnabled('btnVehiculo', false);
    //
    //this.ButtonEnabled('btnServicio', false);
    //this.ButtonEnabled('btnPago', false);
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

}
