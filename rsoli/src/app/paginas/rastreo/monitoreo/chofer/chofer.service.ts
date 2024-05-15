import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ChoferModelo } from './chofer-modelo';

@Injectable({
  providedIn: 'root'
})
export class ChoferService {

  baseURL: string = "";
  token = "";
  headers_token = {};

  constructor(private http: HttpClient) { }
  actualizar_accesos() {
    this.baseURL = environment.apiUrl + "/chofer/";
    this.token = JSON.parse(localStorage.getItem('accesos') || '{}').access_token;
    this.headers_token = { 'headers': { 'content-type': 'aplication/json', 'X-Requested-With': 'XMLHttpRequest', 'Authorization': 'Bearer ' + this.token } };
  }
  get_choferes() {
    this.actualizar_accesos();
    return this.http.get(this.baseURL + 'lista_chofer', this.headers_token);
  }
  post_chofer(persona: ChoferModelo) {
    this.actualizar_accesos();
    const body = JSON.stringify(persona);
    return this.http.post(this.baseURL + 'post_chofer', body, this.headers_token);
  }
  eliminar_chofer(id: number) {
    this.actualizar_accesos();
    return this.http.get(this.baseURL + 'eliminar_chofer/' + id, this.headers_token);
  }

}
