import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class TraccarService {

  constructor(
    private http:HttpClient,
    private cookieService: CookieService
  ) { }

  post_iniciar_sesion(){
    
    //const body=JSON.stringify({email:"admin",password:"jdjPropio10711@"});
    let headers ={ 'headers': { 'content-type': 'application/x-www-form-urlencoded', 'X-Requested-With': 'XMLHttpRequest'}}; 

    return this.http.post("https://kolosu.com/api/session", "email=admin&password=jdjPropio10711@",headers);
    
  }
  conection(token:String){
    //document.cookie = 'JSESSIONID=' + token + '; path=/';
    let socket = new WebSocket("wss://kolosu.com/api/socket");

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
