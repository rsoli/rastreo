import { Component, OnInit } from '@angular/core';
import {MessageService} from 'primeng/api';
import { ApiService } from '../../servicios/api.service';
import { UsuarioModelo } from '../../modelos/usuario-modelo';
import { Router } from '@angular/router';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.scss'],
  providers: [MessageService]
})
export class UsuarioComponent implements OnInit{
  loading=false;
  lista_usuarios :Array<UsuarioModelo>=[];
  columnas_usuario = UsuarioModelo.columns; 
  columnas_contrasena = UsuarioModelo.columns_password; 
  es_admin:boolean=false;
  toolbarButtons=new Array();
  modal_contrasena:boolean=false;
  lista_usuarios_seleccionado={};

  constructor(
    private messageService: MessageService,
    private apiService: ApiService<UsuarioModelo>,
    private router: Router
  ) { }

  ngOnInit(): void {

    this.ListarUsuarios();
    UsuarioModelo.initialize(this.apiService);
    this.verSession();
    this.AgregarBotones();

  }
  AgregarBotones(){

    this.toolbarButtons.push(
      { name:"btnModalPass", 
        label: 'Contraseña',
        tooltip: 'Cambiar contraseña',
        action: 'onModalPass', 
        icon: 'pi pi-user-edit',
        disabled:true,
        class:'p-button-rounded p-button-info'
      });  

  }
  ButtonClick(event: { action: string, rowData: any }) {

    const { action, rowData } = event;
  
    if (action === 'onModalPass') {

      console.log("Editar contraseña");
      // this.lista_usuarios_seleccionado = {}
      this.modal_contrasena=true;
      
    } 

  }
  seleccionarUsuario(usuario:UsuarioModelo){
    this.messageService.clear();
    this.MensajeInfo(usuario.persona,true);
    this.ButtonEnabled('btnModalPass', false);

    this.lista_usuarios_seleccionado=usuario; //para enviar al modal dinamico
    console.log(this.lista_usuarios_seleccionado);
    
    
  }
  deshacerSeleccionUsuario(usuario:UsuarioModelo){

    this.ButtonEnabled('btnModalPass', true);
    
  }
  verSession(){
    // console.log("ver session",JSON.parse(localStorage.getItem('accesos') || '{}'));
    
    this.es_admin = (JSON.parse(localStorage.getItem('accesos') || '{}').sesion)==true?false:true;
  }

  ListarUsuarios() {

    this.loading=true;

    this.apiService.getAll('auth/lista_usuarios').subscribe({
      next: (data: UsuarioModelo[]) => {

        this.lista_usuarios = JSON.parse(JSON.stringify(data)).lista_usuarios;

      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        this.loading = false;
      }
    });

  }
  guardarUsuario(usuario:UsuarioModelo){

    this.loading = true;
    usuario.id_persona =JSON.parse(JSON.stringify(usuario)).id_persona.value;

    let roles =JSON.parse(JSON.stringify(usuario)).id_roles;
    usuario.id_roles=roles.map((p: { label: any; value: any; }) => ({id_rol: p.value }));

    /*console.log("usuario1 ",usuario.id_persona );
    console.log("usuario2 ",usuario.id_roles );*/
    

    this.apiService.create('auth/post_usuario', usuario).subscribe({
      next: (data: any) => {

        const mensaje = data?.mensaje?.[0];
  
        if (mensaje) {

          this.MensajeError(mensaje);

        } else {

          this.ListarUsuarios();
          
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
  
  eliminarUsuario(usuario:UsuarioModelo){
    // console.log("usuaruo ",usuario);
    
    if (usuario.id_usuario) {
      this.loading = true;

      this.apiService.delete('auth/eliminar_usuario', usuario.id_usuario).subscribe({
        next: () => {

          this.ListarUsuarios(); // Refresca la lista tras eliminar

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
  guardarModal(usuario:any){
    
    console.log("llego modal ",usuario);
    if(usuario.contrasena==usuario.repetir_contrasena){

      this.cerrarModal();
      this.cambiarContrasena(usuario);
      this.lista_usuarios_seleccionado=[];

    }else{
      
      this.MensajeError("Las contraseñas no coinciden");

    }
    
    
  }
  cambiarContrasena(usuario:any){

    this.loading=true;
    this.apiService.create('auth/post_cambio_contrasena', usuario).subscribe({
      next: () => {

        this.ListarUsuarios(); // Refresca la lista tras eliminar

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
  cerrarModal(){
    this.modal_contrasena = false;
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
