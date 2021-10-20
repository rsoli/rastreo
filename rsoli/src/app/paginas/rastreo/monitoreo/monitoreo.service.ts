import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { environment } from 'src/environments/environment';

// import { PersonaModelo } from './persona-modelo';

@Injectable({
  providedIn: 'root'
})
export class MonitoreoService {

  baseURL: string = "";
  token = "";
  headers_token = {}; 

  constructor(private http:HttpClient) { }
  actualizar_accesos(){
    this.baseURL = environment.apiUrl+"/servicio/";
    this.token = JSON.parse(localStorage.getItem('accesos')|| '{}').access_token;
    this.headers_token = { 'headers': { 'content-type': 'aplication/json', 'X-Requested-With': 'XMLHttpRequest','Authorization':'Bearer '+this.token } }; 
  }
  get_filtros_monitoreo(){
    this.actualizar_accesos();
    return this.http.get(this.baseURL + 'filtros_monitoreo', this.headers_token);
  }
  post_monitoreo_tiempo_real(parametros:any){
    this.actualizar_accesos();
    const body=JSON.stringify(parametros);
    return this.http.post(this.baseURL + 'monitoreo_tiempo_real',body, this.headers_token);
  }
  post_monitoreo_rutas(parametros:any){
    this.actualizar_accesos();
    const body=JSON.stringify(parametros);
    return this.http.post(this.baseURL + 'monitoreo_rutas',body, this.headers_token);
  }

}
