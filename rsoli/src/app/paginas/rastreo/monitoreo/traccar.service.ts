import { Injectable } from '@angular/core';
import {HttpClient, HttpHandler, HttpHeaders} from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class TraccarService {

  headers_token:any; 
  
  constructor(
    private http:HttpClient,
    private cookieService: CookieService
  ) { }

  post_iniciar_sesion(){

  let headers = new HttpHeaders()
    .set('content-type','application/x-www-form-urlencoded; charset=UTF-8')
    .set('X-Requested-With','XMLHttpRequest')
    .set('Accept','*/*');

   return this.http.post<any>('https://www.kolosu.com/traccar/api/session', "email=admin&password=jdjPropio10711@", { 'headers':headers, observe: 'response', withCredentials: true })

    //const body=JSON.stringify({email:"admin",password:"jdjPropio10711@"});
    //let headers ={ 'headers': { 'content-type': 'application/x-www-form-urlencoded', 'X-Requested-With': 'XMLHttpRequest'}}; 


    //return this.http.post("https://kolosu.com/traccar/api/session", "email=admin&password=jdjPropio10711@",{headers});
    
  }
  get_motorizado(token:any){
    let headers = new HttpHeaders()
    .set('content-type','application/json');

    return this.http.get('https://www.kolosu.com/traccar/api/devices', { 'headers':headers,withCredentials: true })

  }
  get_viajes(v_deviceId:Number,v_fecha_inicio:String,v_fecha_fin:String){
    let headers = new HttpHeaders()
        .set('content-type','application/json');

    let parametros='?deviceId='+v_deviceId+'&from='+v_fecha_inicio+'&to='+v_fecha_fin;
    return this.http.get('https://www.kolosu.com/traccar/api/reports/trips'+parametros, { 'headers':headers,withCredentials: true })
  }
  get_rutas(v_deviceId:Number,v_fecha_inicio:String,v_fecha_fin:String){
    let headers = new HttpHeaders()
        .set('content-type','application/json');

    let parametros='?deviceId='+v_deviceId+'&from='+v_fecha_inicio+'&to='+v_fecha_fin;
    return this.http.get('https://www.kolosu.com/traccar/api/reports/route'+parametros, { 'headers':headers,withCredentials: true })
  }
  conection(token:String){
   
    let socket = new WebSocket("wss://www.kolosu.com/traccar/api/socket?token="+token);

    socket.onopen = function(e) {
      //alert("[open] Connection established");
      //alert("Sending to server");
      
      console.log("cnexion establecida ");
      //socket.send(String(token));
      //this.cookieService.set( 'name', 'Test Cookie' );
      //socket.send("My name is John");
    };
    
    socket.onmessage = function(event) {
      console.log("dato recibido ",  JSON.parse(event.data));
      //alert(`[message] Data received from server: ${event.data}`);
    };
    
    socket.onclose = function(event) {
      if (event.wasClean) {
        alert(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
      } else {
        // e.g. server process killed or network down
        // event.code is usually 1006 in this case
        alert('[close] Connection died');
      }
    };
    
    socket.onerror = function(error) {
      alert(`[error]`);
    };
    
  }

}
