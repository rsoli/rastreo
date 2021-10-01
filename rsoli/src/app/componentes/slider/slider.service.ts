import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Image } from './modelo-slider';

@Injectable({
  providedIn: 'root'
})
export class SliderService {
  baseURL: string = "";
  token = "";
  headers_token = {}; 

  constructor(private http: HttpClient) { }
  actualizar_accesos(){
    this.baseURL = environment.apiUrl+"/persona/";
    this.token = JSON.parse(JSON.stringify(localStorage.getItem('accesos'))).access_token;
    this.headers_token = { 'headers': { 'content-type': 'aplication/json', 'X-Requested-With': 'XMLHttpRequest','Authorization':'Bearer '+this.token } }; 
  }

  getImages() {
    return this.http.get<any>('./imagenes.json')
      .toPromise()
      .then(res => <Image[]>res.data)
      .then(data => { return data; });
  }
}
