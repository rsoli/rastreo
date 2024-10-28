import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService<T> {
  private baseUrl: string='';
  private token: string='';
  private headers_token: any;

  constructor(private http: HttpClient) { }

  // Método para actualizar los accesos y obtener el token
  private actualizarAccesos() {
    this.token = JSON.parse(localStorage.getItem('accesos') || '{}').access_token;
    this.headers_token = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'Authorization': `Bearer ${this.token}`
      })
    };
  }

  // Método para obtener todos los registros
  getAll(url: string): Observable<T[]> {
    this.actualizarAccesos();
    url=environment.apiUrl+'/'+url;
    return this.http.get<T[]>(url, { headers: this.headers_token.headers, observe: 'body' });
  }

  // Método para obtener un registro por ID
  getById(url: string, id: number): Observable<T> {
    this.actualizarAccesos();
    url=environment.apiUrl+'/'+url;
    return this.http.get<T>(`${url}/${id}`, { headers: this.headers_token.headers, observe: 'body' });
  }

  // Método para crear un nuevo registro
  create(url: string, data: T): Observable<T> {
    this.actualizarAccesos();
    url=environment.apiUrl+'/'+url;
    return this.http.post<T>(url, data, { headers: this.headers_token.headers, observe: 'body' });
  }

  // Método para actualizar un registro
  update(url: string, id: number, data: T): Observable<T> {
    this.actualizarAccesos();
    url=environment.apiUrl+'/'+url;
    return this.http.put<T>(`${url}/${id}`, data, { headers: this.headers_token.headers, observe: 'body' });
  }

  // Método para eliminar un registro
  delete(url: string, id: number): Observable<void> {
    this.actualizarAccesos();
    url=environment.apiUrl+'/'+url;
    return this.http.get<void>(`${url}/${id}`, { headers: this.headers_token.headers, observe: 'body' });
  }
  delete_aux(url: string, id: number): Observable<void> {
    this.actualizarAccesos();
    url=environment.apiUrl+'/'+url;
    return this.http.delete<void>(`${url}/${id}`, { headers: this.headers_token.headers, observe: 'body' });
  }

}
