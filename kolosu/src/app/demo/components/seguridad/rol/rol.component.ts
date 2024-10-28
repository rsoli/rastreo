
import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ApiService } from '../../servicios/api.service';
import { RolModelo } from '../../modelos/rol-modelo';
import { Router } from '@angular/router';

@Component({
  selector: 'app-rol',
  templateUrl: './rol.component.html',
  styleUrls: ['./rol.component.css'],
  providers: [MessageService]
})
export class RolComponent implements OnInit {

  loading = false;
  lista_rol : Array<RolModelo> = [];
  columnas_rol = RolModelo.columns;
  toolbarButtons = new Array();

  constructor(private apiService: ApiService<RolModelo>, private messageService: MessageService, private router: Router) { }

  ngOnInit(): void {
    this.ListarRol();
    RolModelo.initialize(this.apiService);
    
  }

  ListarRol() {
    this.loading = true;

    this.apiService.getAll('rol/lista_roles').subscribe({
      next: (data: RolModelo[]) => {
        
        this.lista_rol = JSON.parse(JSON.stringify(data)).roles;

      },
      error: (error) => {

        this.MensajeError("Error al obtener la lista");

      },
      complete: () => {

        this.loading = false;
        
      }
    });
  }

  guardarRol(rol: RolModelo) {

    this.loading = true;

    // Limpiar los permisos para evitar referencias circulares
    const cleanIdPermisos = rol.id_permisos.map((permiso: any) => ({
      key: permiso.key,
      label: permiso.label
    }));

    // Crear un objeto limpio para enviar
    const cleanRol = {
      ...rol,
      id_permisos: cleanIdPermisos // Asegúrate de usar el formato correcto aquí
    };

    this.apiService.create('rol/post_roles_admin', cleanRol).subscribe({
      next: (data: any) => {
        const mensaje = data?.mensaje?.[0];
        if (mensaje) {
          this.MensajeError(mensaje);
        } else {
          this.ListarRol();
        }
      },
      error: (error) => {
        console.log(error);
        
        this.MensajeError("Verifique su conexión a internet");
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
  eliminarRol(rol: RolModelo) {
    if (rol.id_rol) {
      this.loading = true;

      this.apiService.delete('rol/eliminar_rol', rol.id_rol).subscribe({
        next: () => {
          this.ListarRol();
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

  seleccionarRol(rol: RolModelo) {
    this.messageService.clear();
    this.MensajeInfo(rol.nombre_rol+'',true);
  }

  deshacerSeleccionRol(rol: RolModelo) { }



  ButtonClick(event: { action: string, rowData: any }) {
    const { action, rowData } = event;

    if (action === 'onPruba1') {
        // L�gica para 'onPruba1'
    } 
    else if (action === 'onPruba2') {
        // L�gica para 'onPruba2'
    } 
    else {
        console.error('Acci�n no soportada');
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
