import { Component,OnInit,NgZone, OnDestroy } from '@angular/core';
import{TraccarService} from '../traccar.service';
import { VehiculoService } from '../../servicio/vehiculo/vehiculo.service';

import * as L from 'leaflet';
import 'leaflet-rotatedmarker';
import { formatDate } from '@angular/common';
import DriftMarker from "leaflet-drift-marker";
import { CookieService } from 'ngx-cookie-service';
@Component({
  selector: 'app-monitoreo-google',
  templateUrl: './monitoreo-google.component.html',
  styleUrls: ['./monitoreo-google.component.css']
})
export class MonitoreoGoogleComponent implements OnInit ,OnDestroy {

  private timeout: any;

  private map: any;
  marker: any;
  lista_marcadores:any;
  polylines:any;

  lista_dispositivos :Array<String>=[];
  
  aux=new Array();
  markers =new Array();
  lista_dispositivos_usuario:Array<String>=[];

  constructor(
    private traccar:TraccarService,
    private monitoreo_servicio:VehiculoService,
    private cookieService: CookieService 
  ) { }

  ngOnInit(): void {
    this.initMap();

/*
  let icon:any;
  icon = {
  icon: L.icon({
    iconUrl: './assets/icono/marcadores/ubicacion/ubi-azul.svg',
    iconSize:     [25, 31],
    iconAnchor:   [12, 28],
    popupAnchor:  [-0, -27] 
  })
};

    const marker = new DriftMarker([10, 10],icon);
    marker.bindPopup("<div font-size: 8px; z-index:1000' > <div style='text-align: left;' >hola juan"+
  
    "<div> ");
    marker.addTo(this.map);
    marker.slideTo([20, 20], {
      duration: 3000,
      keepAtCenter: false,
    });*/


    this.InicarSesion();
  }
  InicarSesion(){
    this.traccar.post_iniciar_sesion().subscribe( data=>{
      console.log( JSON.parse( JSON.stringify(data))  );
      let token =JSON.parse( JSON.stringify(data)).body.token;
      //document.cookie = "JSESSIONID="+token; 
      this.cookieService.set( 'JSESSIONID', this.cookieService.get('Set-Cookie') ); 
      this.GetMotorizado(token);
      


    },
    error=>{
       
    })
  }
  GetMotorizado(token:String){
    this.traccar.get_motorizado(token).subscribe(data=>{
      
      //let token =JSON.parse( JSON.stringify(data)).token;

      this.lista_dispositivos=JSON.parse( JSON.stringify(data));
      this.ConectarSocket(token);
      this.lista_dispositivos_usuario = JSON.parse(localStorage.getItem('accesos')|| '{}').Vehiculo;
      console.log( "dispositvos test ",this.lista_dispositivos_usuario );
    },
    error=>{
       
    })
  }
  ConectarSocket(token:String){
    //this.traccar.conection(token);

    let socket = new WebSocket("wss://www.kolosu.com/traccar/api/socket?token="+token);

    socket.onopen = function(e) {
      //alert("[open] Connection established");
      //alert("Sending to server");
      console.log(" Connection established");
      //socket.send("My name is John");
    };

    socket.onmessage = function(event) {
      
      //alert(`[message] Data received from server: ${event.data}`);
    };

    socket.onclose = function(event) {
      if (event.wasClean) {
        console.log(" Connection closed");
        //alert(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
      } else {
        // e.g. server process killed or network down
        // event.code is usually 1006 in this case
        //alert('[close] Connection died');

      }
    };

    socket.onerror = function(error) {
      //alert(`[error]`);
      
      console.log(" error socket");
    };

    socket.addEventListener('message', (event) => {
      //this.Mapa(event.data);
      this.AgregarMarcador(event);
    });
    socket.addEventListener('open', (event) => {
      this.ngOnDestroy(); 
    });
    socket.addEventListener('close', (event) => {
      this.reconecta(token);
    });
    socket.addEventListener('error', (event) => {
      this.ngOnDestroy(); 
    });
  }
  reconecta(token:String){

    this.timeout = setInterval(() => {
      console.log("enter timeout");
      this.ConectarSocket(token);
    }, 5000);

  }
  Mapa(data:any){
    if(data.indexOf('positions') !== -1   ){
      console.log("positions ", JSON.parse(data));
    }
    if(data.indexOf('devices') !== -1 ){
      console.log("devices ",JSON.parse(data));
    }
  }
  ngOnDestroy(): void {

    if (this.timeout) {
      console.log('clear timer ');
      clearInterval(this.timeout);
      this.timeout = null;
    }
  }
  initMap() {

    var  osm, controlCapas;

    this.map = L.map('map2', {
      center: [-16.6574403011881, -64.95190911770706],
      zoom: 6
    });
    osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        minZoom: 1,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright"/>OpenStreetMap</a>'
    }).addTo(this.map);

    var OpenStreetMap_HOT = L.tileLayer('http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright"/>OpenStreetMap</a>'
    });

    var Stamen_Toner = L.tileLayer('http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png', {
        attribution: 'Map tiles by <a href="http://stamen.com"/>Stamen Design</a>',
        subdomains: 'abcd',
        minZoom: 0,
        maxZoom: 20
    });
          
    var Esri_WorldStreetMap = 
        L.tileLayer(
            'http://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
                attribution: 'Tiles &copy; Esri'
            });

    var Esri_WorldTopoMap =
        L.tileLayer(
            'http://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
                attribution: 'Tiles &copy; Esri'
            });
    var Esri_WorldImagery =
        L.tileLayer(
            'http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
                attribution: 'Tiles &copy; Esri'
            });



    var mapaBase = {
        'OSM': osm,
        'OpenStreetMap_HOT': OpenStreetMap_HOT,
        'Stamen_Toner': Stamen_Toner,
        'Esri_WorldStreetMap': Esri_WorldStreetMap,
        'Esri_WorldTopoMap': Esri_WorldTopoMap,
        'Satelite': Esri_WorldImagery,
    };

    var SafeCast = L.tileLayer('https://s3.amazonaws.com/te512.safecast.org/{z}/{x}/{y}.png', {
        maxZoom: 16,
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | Map style: &copy; <a href=" ">CC-BY-SA</a>)'
    });
    // var overlay = {"Safecat":SafeCast}


    var controlEscala;

    // controlCapas = L.control.layers(mapaBase, overlay);
    controlCapas = L.control.layers(mapaBase);
    controlCapas.addTo(this.map);

    controlEscala = L.control.scale();
    controlEscala.addTo(this.map);



  }
  borrarMarcadores() {
    if(this.lista_marcadores){
      for (let indice of this.lista_marcadores){
        this.map.removeLayer(indice);
      }
    }
  }
  //AgregarMarcador(marcadores:any) {
  AgregarMarcador(event:any) {

    let icon:any;
    icon = {
      icon: L.icon({
        /*iconSize: [25, 31],
        iconAnchor: [12, 31],*/
        iconUrl: './assets/icono/marcadores/ubicacion/ubi-azul.svg',
        iconSize:     [25, 31],
        //shadowSize:   [50, 64],
        iconAnchor:   [12, 28],
        //shadowAnchor: [4, 62],
        popupAnchor:  [-0, -27] //horizontal  vertical
      })
    };

    let data = JSON.parse(event.data);
    if (data.positions) {
        for (let i = 0; i < data.positions.length; i++) {


            let position = data.positions[i];

            //nuevo codigo
            let indice_device = this.lista_dispositivos_usuario.findIndex(device => JSON.parse(JSON.stringify(device)).id_dispositivo === position.deviceId);
            console.log("test ",indice_device);
            
            if(indice_device !=-1){
              let marker = this.markers[position.deviceId];
              this.marker = [position.latitude, position.longitude];
              console.log(data.positions);
              let hora=new Date(position.deviceTime);
              if (!marker) {
                 
                  marker = new DriftMarker(this.marker,icon); 
                  //marker = L.marker(this.marker, icon).addTo(this.map);
                  this.markers[position.deviceId] = marker;
                  //marker.addTo(this.map);
                   //marker = new DriftMarker(this.marker,icon); 
                   //this.marcador_anterior[position.deviceId] = marker; //nuevo
                  // let placa = this.lista_dispositivos.find(dispositivos => dispositivos.id === position.deviceId);
                  let indice = this.lista_dispositivos.findIndex(device => JSON.parse(JSON.stringify(device)).id === position.deviceId);
                  marker.bindPopup("<div font-size: 8px; z-index:1000' > <div style='text-align: left;' > "+
                  "<b>Placa :</b>  "+ JSON.parse(JSON.stringify(this.lista_dispositivos[indice])).name+'<br/>'+
                  "<b>Velocidad :</b>  "+(position.speed * 1.852).toFixed(1)+' Km/h<br/>'+
                  (position.deviceTime!=null?'<b>Fecha :</b> '+formatDate(position.deviceTime, 'dd/MM/yyyy ', 'en-US')+' '+hora.toLocaleTimeString()+'<br/>':'')+
                  (position.attributes.batteryLevel!=null?'<b>Bat gps :</b> '+parseFloat(position.attributes.batteryLevel).toFixed(1)+'%<br/>':'')+
                  (position.attributes.battery!=null?'<b>Bat gps :</b> '+parseFloat(position.attributes.battery).toFixed(1)+' Volt.<br/>':'')+
                  (position.attributes.power!=null?'<b>Bat vehículo :</b> '+parseFloat(position.attributes.power).toFixed(1)+' Volt.<br/>':'')+
                  (position.address!=null?'<b>Ubicación</b><br/> '+position.address:'')+
                  "<div> ");
  
                  marker.addTo(this.map);
  
  
                  console.log("actualizando1");
                  
              } else {
                console.log("actualizando2");
                
               
  
                  /*marker.setLatLng(this.marker,{
                    duration: 3000,
                    keepAtCenter: false,
                  });*/
                   marker.slideTo(this.marker, {
                     duration: 2000,
                     keepAtCenter: false,
                   });
  
                  let indice = this.lista_dispositivos.findIndex(device => JSON.parse(JSON.stringify(device)).id === position.deviceId);
                  marker.bindPopup("<div font-size: 8px; z-index:1000' > <div style='text-align: left;' >"+
                  "<b>Placa :</b>  "+ JSON.parse(JSON.stringify(this.lista_dispositivos[indice])).name+'<br/>'+
                  "<b>Velocidad :</b>  "+(position.speed * 1.852).toFixed(1)+' Km/h<br/>'+
                  (position.deviceTime!=null?'<b>Fecha :</b> '+formatDate(position.deviceTime, 'dd/MM/yyyy ', 'en-US')+' '+hora.toLocaleTimeString()+'<br/>':'')+
                  (position.attributes.batteryLevel!=null?'<b>Bat gps :</b> '+parseFloat(position.attributes.batteryLevel).toFixed(1)+'%<br/>':'')+
                  (position.attributes.battery!=null?'<b>Bat gps :</b> '+parseFloat(position.attributes.battery).toFixed(1)+' Volt.<br/>':'')+
                  (position.attributes.power!=null?'<b>Bat vehículo :</b> '+parseFloat(position.attributes.power).toFixed(1)+' Volt.<br/>':'')+
                  (position.address!=null?'<b>Ubicación</b><br/> '+position.address:'')+
                  "<div> ");
  
  
              }
            }
            //// fi nuevo codigo


        }

    }

    //solucion a problema de boton close de popop
    document.querySelector('.leaflet-pane.leaflet-popup-pane')!.addEventListener('click', event => {
      event.preventDefault();
    });
    
  }

}
