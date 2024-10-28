import { Component, OnInit } from '@angular/core';
import { ChoferModelo } from '../../modelos/chofer-modelo';
import { MessageService } from 'primeng/api';
// import { PersonasService } from '../../servicios/personas.service';
import { ApiService } from '../../servicios/api.service';

@Component({
  selector: 'app-chofer',
  templateUrl: './chofer.component.html',
  styleUrls: ['./chofer.component.scss'],
  providers: [MessageService]
})
export class ChoferComponent implements OnInit {

  lista_choferes :Array<ChoferModelo>=[];
  loading=false;
  columnas_chofer = ChoferModelo.columns; 
  primaryKeyChofer = ChoferModelo.primaryKey;
  toolbarButtons=new Array();

    
  constructor(
    private messageService: MessageService,
    private apiService: ApiService<ChoferModelo>
  ) { }

  ngOnInit(): void {

    this.ListarChoferes();
    ChoferModelo.initialize(this.apiService);
    this.AgregarBotones();

  }
  ListarChoferes() {

    this.loading=true;

    this.apiService.getAll('chofer/lista_chofer').subscribe({
      next: (data: ChoferModelo[]) => {

        this.lista_choferes = JSON.parse(JSON.stringify(data)).lista_chofer;

      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        this.loading = false;
      }
    });

  }
  guardarChofer(chofer: ChoferModelo) { 

    //cuadno es un solo 1
    /*chofer.id_personas =JSON.parse(JSON.stringify(chofer)).id_personas.value;
    console.log("unico ",chofer);*/

    //cuando es seleccion multiple
    //let persona =JSON.parse(JSON.stringify(chofer)).id_personas;
    //chofer.id_personas=persona.map((p: { label: any; value: any; }) => ({id_persona: p.value }));
    //console.log("id_persona ",chofer);
    
    //console.log("Editat en backend para el insertado con value los campos tipo select multiple ",chofer);

    this.loading = true;

    this.apiService.create('chofer/post_chofer', chofer).subscribe({
      next: (data: any) => {

        const mensaje = data?.mensaje?.[0];
  
        if (mensaje) {

          this.MensajeError(mensaje);

        } else {

          this.ListarChoferes();
          
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
  eliminarChofer(chofer: ChoferModelo) {

    if (chofer.id_chofer) {
      this.loading = true;

      this.apiService.delete('chofer/eliminar_chofer', chofer.id_chofer).subscribe({
        next: () => {

          this.ListarChoferes(); // Refresca la lista tras eliminar

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
  seleccionarChofer(chofer: ChoferModelo){
    // console.log("ver chofer ",chofer.id_chofer);
    this.setButtonEnabled('export', false);
    this.setButtonEnabled('print', false);

    this.messageService.clear();
    this.MensajeInfo(chofer.nombre+' '+chofer.apellido_paterno+' '+chofer.apellido_materno,true);
  }

  deshacerSeleccionChofer(chofer: ChoferModelo){
    this.setButtonEnabled('export', true);
    this.setButtonEnabled('print', true);
  }
  AgregarBotones(){

    this.toolbarButtons.push(
      { name:"export", 
        label: 'Exportar PDF', 
        action: 'onExport', 
        icon: 'pi pi-file-export',
        disabled:true,
        class:'p-button-rounded p-button-warning mr-2'
      });

    this.toolbarButtons.push(
      { name:"print", 
        label: 'Imprimir', 
        action: 'onPrint', 
        icon: 'pi pi-print',
        disabled:true,
        class:'p-button-rounded p-button-warning mr-2'
      });
      

    // toolbarButtons = [
    //   { name:"export", label: 'Exportar PDF', action: 'onExport', icon: 'pi pi-file-export',disabled:true,class:'p-button-rounded p-button-warning mr-2' },
    //   { name:"print", label: 'Imprimir', action: 'onPrint', icon: 'pi pi-print',disabled:true,class:'p-button-rounded p-button-warning mr-2' }
    // ];

    
  }
  setButtonEnabled(name: string, disabled: boolean): void {
    this.toolbarButtons.forEach(btn => {
      if (btn.name === name) {
        btn.disabled = disabled;
      }
    });
  }
  handleButtonClick(event: { action: string, rowData: any }) {

    const { action, rowData } = event;
    
      switch (action) {
        case 'onExport':
          // this.onAdd();
          console.log("ll ",action,rowData);
          
          break;
        case 'onPrint':
          console.log("ll ",action,rowData);
          // this.onEdit(this.selectedRow);
          break;
        default:
          console.error('Acción no soportada');
      }

  }

  MensajeError(mensaje:string){

    
    this.messageService.add({severity:'error', summary: 'Error', detail: mensaje});

  }
  handleButtonAction(action:any,rowData:any){

    console.log("llego botones",action,rowData);
    
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
