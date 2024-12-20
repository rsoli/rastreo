import { Injectable } from '@angular/core';
import {HttpClient, HttpHandler, HttpHeaders, HttpResponse} from '@angular/common/http';
// import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class TraccarService {

  headers_token:any; 

  // private sessionUrl = 'https://www.kolosu.com/traccar/api/session';
  private apiUrl = 'https://www.kolosu.com/traccar/api';

  constructor(
    private http:HttpClient,
    // private cookieService: CookieService
  ) { }
// prueba de sesion

// getSession(token: string): Observable<HttpResponse<any>> {
//   const headers = new HttpHeaders({
//     'Accept': 'application/json'
//   });

//   return this.http.get<any>(`${this.sessionUrl}?token=${token}`, {
//     headers,
//     observe: 'response',
//     withCredentials: true
//   });
// }

//fin prueba de sesion
  // post_iniciar_sesion(token:string){

  //   let headers = new HttpHeaders()
  //      .set('content-type','application/json;');
  //     return this.http.get('https://www.kolosu.com/traccar/api/session?token='+token, { observe: 'response', withCredentials: true })
      
  // }
  post_iniciar_sesion(token: string) {
    let headers = new HttpHeaders()
        .set('Accept', 'application/json'); // Solo el encabezado Accept

    return this.http.get('https://www.kolosu.com/traccar/api/session?token=' + token, {
        headers: headers,
        observe: 'response',
        withCredentials: true
    });
}


  get_motorizado(token:any){
    let headers = new HttpHeaders()
    .set('content-type','application/json');

    return this.http.get('https://www.kolosu.com/traccar/api/devices', { 'headers':headers,withCredentials: true })

  }
  get_viajes(v_deviceId:Number,v_fecha_inicio:any,v_fecha_fin:any){
    let headers = new HttpHeaders()
        .set('content-type','application/json');

    let parametros='?deviceId='+v_deviceId+'&from='+v_fecha_inicio+'&to='+v_fecha_fin;
    return this.http.get('https://www.kolosu.com/traccar/api/reports/trips'+parametros, { 'headers':headers,withCredentials: true })
  }
  get_rutas(v_deviceId:Number,v_fecha_inicio:any,v_fecha_fin:any){
    let headers = new HttpHeaders()
        .set('content-type','application/json');

        // console.log("ver hora ",v_fecha_inicio);
        
    let parametros='?deviceId='+v_deviceId+'&from='+v_fecha_inicio+'&to='+v_fecha_fin;
    return this.http.get('https://www.kolosu.com/traccar/api/reports/route'+parametros, { 'headers':headers,withCredentials: true })
  }
  get_parqueo(v_deviceId:Number,v_fecha_inicio:any,v_fecha_fin:any){
    let headers = new HttpHeaders()
        .set('content-type','application/json');

        // console.log("ver hora ",v_fecha_inicio);
        
    let parametros='?deviceId='+v_deviceId+'&from='+v_fecha_inicio+'&to='+v_fecha_fin;
    return this.http.get('https://www.kolosu.com/traccar/api/reports/stops'+parametros, { 'headers':headers,withCredentials: true })
  }
  enviarComandoPersonalizado(deviceId: number, command: string): Observable<any> {

      // let headers = new HttpHeaders()
  //   .set('content-type','application/x-www-form-urlencoded; charset=UTF-8')
  //   .set('X-Requested-With','XMLHttpRequest')
  //   .set('Accept','*/*');

  //  return this.http.post<any>('https://www.kolosu.com/traccar/api/session', "test", { 'headers':headers, observe: 'response', withCredentials: true })


  const url = `${this.apiUrl}/commands/send`;
  const body = {
    deviceId: deviceId,
    type: 'custom',
    description: 'Nuevo...', // Agregar descripción
    attributes: {
      data: command
    },
    id:0,
    textChannel:false
  };

  return this.http.post(url, body, { withCredentials: true });
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
  loadVehicles(): Observable<any[]> {
    return this.http.get<any[]>('https://www.kolosu.com/traccar/api/devices', { withCredentials: true });
  }

}
