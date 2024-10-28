import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { RolModelo } from '../modelos/rol-modelo';

@Injectable({
  providedIn: 'root'
})
export class RolService {

  baseURL: string = "";
  token = "";
  headers_token = {};

  constructor(
    private http: HttpClient
  ) { }
  
  actualizar_accesos() {
    this.baseURL = environment.apiUrl + "/rol/";
    this.token = JSON.parse(localStorage.getItem('accesos') || '{}').access_token;
    this.headers_token = { 'headers': { 'content-type': 'aplication/json', 'X-Requested-With': 'XMLHttpRequest', 'Authorization': 'Bearer ' + this.token } };
  }

  get_roles() {
    this.actualizar_accesos();
    return this.http.get(this.baseURL + 'lista_rol', this.headers_token);
  }
  post_rol(rol: RolModelo) {
    this.actualizar_accesos();
    const body = JSON.stringify(rol);
    return this.http.post(this.baseURL + 'post_rol', body, this.headers_token);
  }
  delete_rol(id: number) {
    this.actualizar_accesos();
    return this.http.get(this.baseURL + 'eliminar_rol/' + id, this.headers_token);
  }
}
