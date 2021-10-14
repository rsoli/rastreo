import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { PersonaModelo } from './persona-modelo';


@Injectable({
  providedIn: 'root'
})
export class PersonaService {

  baseURL: string = "";
  token = "";
  headers_token = {}; 

  constructor(private http:HttpClient) { }
  actualizar_accesos(){
    this.baseURL = environment.apiUrl+"/persona/";
    this.token = JSON.parse(localStorage.getItem('accesos')|| '{}').access_token;
    this.headers_token = { 'headers': { 'content-type': 'aplication/json', 'X-Requested-With': 'XMLHttpRequest','Authorization':'Bearer '+this.token } }; 
  }
  get_personas(){
    this.actualizar_accesos();
    return this.http.get(this.baseURL + 'lista_persona', this.headers_token);
  }
}
