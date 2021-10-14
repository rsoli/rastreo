import { Component, OnInit, ViewChild } from '@angular/core';
import { UsuarioModelo } from '../usuario-modelo';
import { UsuarioService } from '../usuario.service';
import { Table } from 'primeng/table';
import {MessageService} from 'primeng/api';
import Swal from'sweetalert2';

@Component({
  selector: 'app-lista-usuario',
  templateUrl: './lista-usuario.component.html',
  styleUrls: ['./lista-usuario.component.css'],
  providers: [MessageService]
})
export class ListaUsuarioComponent implements OnInit {

  lista_usuarios :Array<UsuarioModelo>=[];
  usuario_seleccionado=new UsuarioModelo();
  loading: boolean = true;
  @ViewChild('dt') table!: Table;
  
  constructor(
    private usuario_servicio:UsuarioService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.GetUsuarios();
  }
  GetUsuarios(){
    this.usuario_servicio.get_usuarios().subscribe(data=>{ 
      this.loading = false;
      console.log("ver res ",data);
      this.lista_usuarios=JSON.parse(JSON.stringify(data)).usuarios;
    })
  }
  SeleccionarUsuario(usuario: UsuarioModelo){
    this.BorrarToast();
    this.usuario_seleccionado=usuario;
    this.messageService.add({severity: 'info', summary: 'Usuario seleccionado', detail: (this.usuario_seleccionado.usuario).toString() });
  }
  FormularioUsuario(){

  }
  EliminarUsuario(){
    this.BorrarToast();
    if(this.usuario_seleccionado.id_usuario){

        Swal.fire({
          title: '¿Esta segur@?',
          text: "No podra revertir esta acción!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'SI, Eliminar!',
          cancelButtonText: 'Cancelar'
        }).then((result) => {
          if (result.isConfirmed) {
            //eliminar
          }
        })

    }else{  
      this.messageService.add({severity:'warn', summary: 'Alerta', detail: 'Seleccione un usuario para eliminar'});
    }
  }
  BorrarToast() {
    this.messageService.clear();
  }


}
