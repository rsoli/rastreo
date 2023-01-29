import { Component, OnInit } from '@angular/core';
import{TraccarService} from '../traccar.service';

@Component({
  selector: 'app-monitoreo-google',
  templateUrl: './monitoreo-google.component.html',
  styleUrls: ['./monitoreo-google.component.css']
})
export class MonitoreoGoogleComponent implements OnInit {

  constructor(
    private traccar:TraccarService
  ) { }

  ngOnInit(): void {
    this.InicarSesion();
  }
  InicarSesion(){
    this.traccar.post_iniciar_sesion().subscribe(data=>{
      console.log( JSON.parse( JSON.stringify(data))  );
      let token =JSON.parse( JSON.stringify(data)).token;
      //document.cookie = "JSESSIONID="+token; 

      this.ConectarSocket(token);
    },
    error=>{
       
    })
  }
  ConectarSocket(token:string){
    this.traccar.conection(token);
  }
}
