import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { EntregaModelo } from './entrega-modelo';

@Injectable({
  providedIn: 'root'
})
export class EntregaService {

  baseURL: string = "";
  token = "";
  headers_token = {};

  constructor(
    private http: HttpClient
  ) { }
  actualizar_accesos() {
    this.baseURL = environment.apiUrl + "/entrega/";
    this.token = JSON.parse(localStorage.getItem('accesos') || '{}').access_token;
    this.headers_token = { 'headers': { 'content-type': 'aplication/json', 'X-Requested-With': 'XMLHttpRequest', 'Authorization': 'Bearer ' + this.token } };
  }
  get_entregas() {
    this.actualizar_accesos();
    return this.http.get(this.baseURL + 'lista_entrega', this.headers_token);
  }
  get_entrega(id:Number) {
    this.actualizar_accesos();
    return this.http.get(this.baseURL + 'get_entrega/'+id, this.headers_token);
  }
  post_entrega(entrega:any) {
    this.actualizar_accesos();
    const body = JSON.stringify(entrega);
    return this.http.post(this.baseURL + 'post_entrega', body, this.headers_token);
  }

}
