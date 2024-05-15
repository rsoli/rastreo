import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ZonaModelo } from './zona-model';
import { ZonaGrupoModelo } from './zona-grupo-model';
import { ZonaGrupoDetalleModelo } from './zona-grupo-detalle-model';

@Injectable({
  providedIn: 'root'
})
export class ZonaService {

  baseURL: string = "";
  token = "";
  headers_token = {}; 

  constructor(private http:HttpClient) { }
  actualizar_accesos(){
    this.baseURL = environment.apiUrl+"/zona/";
    this.token = JSON.parse(localStorage.getItem('accesos')|| '{}').access_token;
    this.headers_token = { 'headers': { 'content-type': 'aplication/json', 'X-Requested-With': 'XMLHttpRequest','Authorization':'Bearer '+this.token } }; 
  }
  get_geocercas(){
    this.actualizar_accesos();
    return this.http.get(this.baseURL + 'lista_geocercas', this.headers_token);
  }
  post_geocerca(geocerca:ZonaModelo){
    this.actualizar_accesos();
    const body=JSON.stringify(geocerca);
    return this.http.post(this.baseURL + 'post_geocerca',body,this.headers_token);
  }
  eliminar_geocerca(id:number){
    this.actualizar_accesos();
    return this.http.get(this.baseURL + 'eliminar_geocerca/' + id, this.headers_token);
  }

  get_zona_grupo(){
    this.actualizar_accesos();
    return this.http.get(this.baseURL + 'lista_zona_grupo', this.headers_token);
  }
  post_zona_grupo(zona_grupo:ZonaGrupoModelo){
    this.actualizar_accesos();
    const body=JSON.stringify(zona_grupo);
    return this.http.post(this.baseURL + 'post_zona_grupo',body,this.headers_token);
  }
  eliminar_zona_grupo(id:number){
    this.actualizar_accesos();
    return this.http.get(this.baseURL + 'eliminar_zona_grupo/' + id, this.headers_token);
  }


  get_zona_grupo_detalle(id:number){
    this.actualizar_accesos();
    return this.http.get(this.baseURL + 'lista_zona_grupo_detalle/'+id, this.headers_token);
  }
  post_zona_grupo_detalle(zona_grupo_detalle:ZonaGrupoDetalleModelo){
    this.actualizar_accesos();
    const body=JSON.stringify(zona_grupo_detalle);
    return this.http.post(this.baseURL + 'post_zona_grupo_detalle',body,this.headers_token);
  }
  eliminar_zona_grupo_detalle(id:number){
    this.actualizar_accesos();
    return this.http.get(this.baseURL + 'eliminar_zona_grupo_detalle/' + id, this.headers_token);
  }
  get_zona(id:number){
    this.actualizar_accesos();
    return this.http.get(this.baseURL + 'get_zona/'+id, this.headers_token);
  }


}
