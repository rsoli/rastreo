import { Component, OnInit, ViewChild } from '@angular/core';
import { UsuarioModelo } from '../usuario-modelo';
import { UsuarioService } from '../usuario.service';
import { PrimeNGConfig } from 'primeng/api';
import { Table } from 'primeng/table';


@Component({
  selector: 'app-lista-usuario',
  templateUrl: './lista-usuario.component.html',
  styleUrls: ['./lista-usuario.component.css']
})
export class ListaUsuarioComponent implements OnInit {

  lista_usuarios :Array<UsuarioModelo>=[];
  loading: boolean = false;

  @ViewChild('dt') table!: Table;

  
  
  constructor(
    private usuario_servicio:UsuarioService,
    private primengConfig: PrimeNGConfig
  ) { }

  ngOnInit(): void {
    this.primengConfig.ripple = true;
    this.GetUsuarios();

  }
  GetUsuarios(){
    this.usuario_servicio.get_usuarios().subscribe(data=>{ 
   
     this.lista_usuarios=JSON.parse(JSON.stringify(data)).usuarios;

     console.log("ver usuario ",this.lista_usuarios);
      // this.lista_usuarios = data["usuarios"];     
    })
  }
  EditarUsuario(id:any){

  }
  EliminarUsuario(id:any){

  }



}
