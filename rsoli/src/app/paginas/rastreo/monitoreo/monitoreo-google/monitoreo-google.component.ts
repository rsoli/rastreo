import { Component, OnInit } from '@angular/core';
import{TraccarService} from '../traccar.service';
import { VehiculoService } from '../../servicio/vehiculo/vehiculo.service';

@Component({
  selector: 'app-monitoreo-google',
  templateUrl: './monitoreo-google.component.html',
  styleUrls: ['./monitoreo-google.component.css']
})
export class MonitoreoGoogleComponent implements OnInit {

  constructor(
    private traccar:TraccarService,
    private monitoreo_servicio:VehiculoService,
  ) { }

  ngOnInit(): void {
    this.InicarSesion();
    //this.InicioTraccar();
  }
  InicioTraccar(){
    this.monitoreo_servicio.inicio_traccar().subscribe(data=>{
      console.log( JSON.parse( JSON.stringify(data)) );
      let token =JSON.parse( JSON.stringify(data)).cookie.JSESSIONID;
      document.cookie = "JSESSIONID="+token; 

      this.ConectarSocket(token);
    },
    error=>{
       
    })
  }
  InicarSesion(){
    this.traccar.post_iniciar_sesion().subscribe(data=>{
      console.log( JSON.parse( JSON.stringify(data))  );
      let token =JSON.parse( JSON.stringify(data)).token;
      //document.cookie = "JSESSIONID="+token; 
      document.cookie = 'JSESSIONID=' + 'node01jdf6t2hpxttetb7xh3jlgm1k242.node0' + '; path=/';
      this.ConectarSocket(token);
    },
    error=>{
       
    })
  }
  ConectarSocket(token:string){
    this.traccar.conection(token);
  }
}
