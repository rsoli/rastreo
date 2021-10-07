import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { UsuarioModelo } from './usuario-modelo';


@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  baseURL: string = "";
  token = "";
  headers_token = {}; 

  constructor(private http:HttpClient) { }
  actualizar_accesos(){
    this.baseURL = environment.apiUrl+"/auth/";
    this.token = JSON.parse(localStorage.getItem('accesos')|| '{}').access_token;
    this.headers_token = { 'headers': { 'content-type': 'aplication/json', 'X-Requested-With': 'XMLHttpRequest','Authorization':'Bearer '+this.token } }; 
  }
  post_iniciar_sesion(UsuarioModelo: any): Observable<any>{
    
    const body=JSON.stringify(UsuarioModelo);
    let headers ={ 'headers': { 'content-type': 'aplication/json', 'X-Requested-With': 'XMLHttpRequest' } };
    return this.http.post(environment.apiUrl+"/iniciar_sesion", body,headers);
    
  }
  post_cerrar_sesion(){
    this.actualizar_accesos();
    return this.http.get(this.baseURL+'cerrar_sesion',this.headers_token);
  }
}
