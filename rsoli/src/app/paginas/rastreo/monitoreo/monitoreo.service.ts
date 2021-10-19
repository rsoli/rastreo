import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
// import { PersonaModelo } from './persona-modelo';

@Injectable({
  providedIn: 'root'
})
export class MonitoreoService {

  constructor(private http:HttpClient) { }
}
