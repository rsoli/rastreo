import { Component,OnInit,NgZone, OnDestroy } from '@angular/core';
import{TraccarService} from '../traccar.service';
import { MonitoreoService } from '../monitoreo.service';

import * as L from 'leaflet';
import 'leaflet-rotatedmarker';
import { formatDate } from '@angular/common';
import DriftMarker from "leaflet-drift-marker";
import { CookieService } from 'ngx-cookie-service';
import { Table } from 'primeng/table';
import Swal from'sweetalert2';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import * as moment from 'moment';
import 'moment-timezone';
import { ErrorHandler } from '@angular/core';
moment.locale("es");

@Component({
  selector: 'app-monitoreo-google',
  templateUrl: './monitoreo-google.component.html',
  styleUrls: ['./monitoreo-google.component.css'],
  providers: [MessageService]
})
export class MonitoreoGoogleComponent implements OnInit ,OnDestroy ,ErrorHandler{

  private timeout: any;

  private map: any;
  marker: any;
  lista_marcadores:any;
  polylines:any;

  lista_dispositivos = new Array();
  lista_dispositivos_aux:Array<String>=[];
  
  aux=new Array();
  markers =new Array();
  lista_dispositivos_usuario:Array<String>=[];

  token ='jlUTEjCCKDUFyTIbT6GLwg0IWwsNArcL';
  contador_error=0;
  public results:any;
  
  icon: any;
  icono_rojo :any;
  icono_inicio :any;
  icono_final :any;
  vehiculo_seleccionado ={lat:0,
    lng:0,
    id_dispositivo:0,
    id_vehiculo:0,
    placa: '',
    motor: '',
    bateria: ''
  };
  bandera_centrado_mapa=false;
  hide_botones=true;
  id_vehiculo_aux=0;



  visibleSidebar1: any;
  fecha_ratreo: Date=new Date();
  fecha_inicio:any=new Date('2023-08-01T00:00:00-04:00');
  fecha_final:any=new Date('2023-08-31T23:59:00-04:00');
  hora_inicio=new Date('2023-10-06T00:00:00');
  hora_fin=new Date('2023-10-06T23:59:59');

  bandera_fecha_ratreo:boolean=false;
  bandera_fecha_inicio:boolean=false;
  bandera_fecha_final:boolean=false;
  bandera_hora_inicio:boolean=false;
  bandera_hora_fin:boolean=false;
  tipo_monitoreo_seleccionado ={code:''};

  lista_viajes :Array<String>=[];
  style_map :String = 'map_tiempo_real';
  bandera_tabla_viaje:boolean=true;


  //viajes
  selected_item:Array<String>=[]
  constructor(
    private traccar:TraccarService,
    private monitoreo_servicio:MonitoreoService,
    private cookieService: CookieService 
  ) { }
  handleError(error: any): void {//para errores de bondle
    const chunkFailedMessage = /Loading chunk [\d]+ failed/;
  
      if (chunkFailedMessage.test(error.message)) {
        window.location.reload();
      }
  }
  ngOnInit(): void {
    
    console.log("ver fecha 2",this.fecha_inicio,this.fecha_final);

    
    this.cargarIcono();
    this.IniciarMapa();
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

    const marker = new DriftMarker([-16.6574403011881, -64.95190911770706],icon);
    marker.bindPopup("<div font-size: 8px; z-index:1000' > <div style='text-align: left;' >hola juan"+
  
    "<div> ");
    marker.addTo(this.map);
    marker.slideTo([-16.6574403011881, -64.95190911770706], {
      duration: 3000,
      keepAtCenter: false,
    });*/

    this.lista_dispositivos_usuario = JSON.parse(localStorage.getItem('accesos') || '{}').Vehiculo;
    this.InicarSesion();
    this.loading_alert();
    this.reconecta();
    

    
  }
  cargarIcono(){
    this.icon = {
      icon: L.icon({
        iconUrl: './assets/icono/marcadores/circulo/ubi_azul.png',
        iconSize: [30, 35],
        iconAnchor: [17, 17],
        popupAnchor: [0, -13] //horizontal  vertical
      })
    };

    this.icono_rojo ={
      icon: L.icon({
        iconUrl: './assets/icono/marcadores/circulo/ubi_rojo.png',
        iconSize: [30, 35],
        iconAnchor: [17, 17],
        popupAnchor: [0, -13] //horizontal  vertical

        
      })
    };
    this.icono_inicio ={
      icon: L.icon({
        iconUrl: './assets/icono/marcadores/circulo/inicio.png',
        // iconSize: [30, 35],
        // iconAnchor: [17, 17],
        // popupAnchor: [0, -13] //horizontal  vertical
        iconSize:     [35, 41],
        iconAnchor:   [1, 39], //vertical  
        popupAnchor:  [-0, -47] 
      })
    };
    this.icono_final ={
      icon: L.icon({
        iconUrl: './assets/icono/marcadores/circulo/final.png',
        // iconSize: [30, 35],
        // iconAnchor: [17, 17],
        // popupAnchor: [0, -13] //horizontal  vertical
        iconSize:     [35, 41],
        iconAnchor:   [1, 39], //vertical  
        popupAnchor:  [-0, -47] 
      })
    };
    // this.icono_rojo ={
    //   icon: L.icon({
    //     iconUrl: './assets/iconos/marcadores/circulo/ubi_rojo.png',
    //     iconSize: [25, 31],
    //     iconAnchor: [12, 28],
    //     popupAnchor: [-0, -27] //horizontal  vertical
    //   })
    // };
  }
  InicarSesion(){
    //let token='jlUTEjCCKDUFyTIbT6GLwg0IWwsNArcL';
    this.traccar.post_iniciar_sesion(this.token).subscribe( data=>{
      console.log( JSON.parse( JSON.stringify(data))  );
      let token =JSON.parse( JSON.stringify(data)).body.token;
      // this.GetMotorizado(token);
      


    },
    error=>{
       
    })
  }
  // GetMotorizado(token:String){
  //   this.traccar.get_motorizado(token).subscribe(data=>{
      
  //     //let token =JSON.parse( JSON.stringify(data)).token;

  //     this.lista_dispositivos=JSON.parse( JSON.stringify(data));
  //     // this.ConectarSocket(token);
  //     this.lista_dispositivos_usuario = JSON.parse(localStorage.getItem('accesos')|| '{}').Vehiculo;
  //     console.log( "dispositvos test ",this.lista_dispositivos_usuario );
  //   },
  //   error=>{
       
  //   })
  // }
  ConectarSocket(){
    //this.traccar.conection(token);

    let socket = new WebSocket("wss://www.kolosu.com/traccar/api/socket?token="+this.token);

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
      this.closeLoading_alert();
      this.ngOnDestroy(); 
    });
    socket.addEventListener('close', (event) => {
      this.reconecta();
      this.contador_error++;
      if(this.contador_error==4){
        window.location.reload();
      }

    });
    socket.addEventListener('error', (event) => {
      this.ngOnDestroy(); 
    });
  }
  reconecta(){

    this.timeout = setInterval(() => {
      console.log("enter timeout");
      this.ConectarSocket();
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
  IniciarMapa() {

    var osm, controlCapas;

    this.map = L.map('map2', {
      center: [-16.6574403011881, -64.95190911770706],
      zoom: 5,
      
     

      fadeAnimation: false,
      zoomAnimation: false,
      markerZoomAnimation: false,

      // zoomDelta: 0.25,
      // zoomSnap: 0.50,

      renderer: L.canvas(),


    })


    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      // attribution: '© OpenStreetMap',
      attribution: '',
      //updateWhenIdle: true,
      //reuseTiles: true
    }).addTo(this.map)

    setTimeout(() => {
      this.map.invalidateSize();
    }, 1000);
    

    osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      minZoom: 1,
      //attribution: '&copy; <a href="http://www.openstreetmap.org/copyright"/>OpenStreetMap</a>'
      attribution: '',
      //updateWhenIdle: true,
    }).addTo(this.map);


      // var Stadia_Outdoors =
      // L.tileLayer(
      //   'https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.png', {
      //   maxZoom: 20,
      //   attribution: '',
      // });
      // var Stadia_OSMBright =
      // L.tileLayer(
      //   'https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png', {
      //   maxZoom: 20,
      //   attribution: '',
      // });

      var Stadia_AlidadeSmoothDark =
      L.tileLayer(
        'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png', {
        //attribution: 'Tiles &copy; Esri'
        //attribution: 'CartoDB.Voyager',
        attribution: '',
        maxZoom: 20,
        //updateWhenIdle: true,
      });

      var googleStreets = L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',{
        maxZoom: 20,
        subdomains:['mt0','mt1','mt2','mt3']
      });

      var googleHybrid = L.tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}',{
        maxZoom: 20,
        subdomains:['mt0','mt1','mt2','mt3']
      });



    var mapaBase = {
      'Osm': osm,
      //'Stamen_Toner': Stamen_Toner,
      //'Esri_WorldStreetMap': Esri_WorldStreetMap,
      //'Esri_WorldTopoMap': Esri_WorldTopoMap,
      // 'Stadia_Outdoors':Stadia_Outdoors,
      // 'Stadia_OSMBright':Stadia_OSMBright,
      'Stadia Oscuro':Stadia_AlidadeSmoothDark,
      'google Calles':googleStreets,
      'google Hibrido':googleHybrid
      // 'Cartografico':positron
    };

    var controlEscala;

    controlCapas = L.control.layers(mapaBase);
    controlCapas.addTo(this.map);


    controlEscala = L.control.scale();
    controlEscala.addTo(this.map);

    //solucion a problema de boton close de popop
    try {
      document.querySelector('.leaflet-pane.leaflet-popup-pane')!.addEventListener('click', event => {
        event.preventDefault();
      });
    } catch (error) {
      //borrar listener del clik close de marker
      document.removeEventListener(
        ".leaflet-pane.leaflet-popup-pane",
        function (event) {
          event.preventDefault();
          event.stopPropagation();
        },
        false
      );
    }

  }
  borrarMarcadores() {
    if(this.lista_marcadores){
      for (let indice of this.lista_marcadores){
        this.map.removeLayer(indice);
      }
    }
  }
  //AgregarMarcador(marcadores:any) {
  AgregarMarcador(event: any) {


    let data = JSON.parse(event.data);
    if (data.positions) {
      for (let i = 0; i < data.positions.length; i++) {


        let position = data.positions[i];

        //nuevo codigo
        let indice_device = this.lista_dispositivos_usuario.findIndex(device => JSON.parse(JSON.stringify(device)).id_dispositivo === position.deviceId);
        

        if (indice_device != -1) {
          //let marker = this.markers[position.deviceId];
          //this.marker = [position.latitude, position.longitude];
          let hora = new Date(position.deviceTime);
          if (!this.markers[position.deviceId]) {

             this.lista_dispositivos.push(
                 {
                   lat:position.latitude,
                   lng:position.longitude,
                   id_dispositivo:position.deviceId,
                   id_vehiculo:JSON.parse(JSON.stringify(this.lista_dispositivos_usuario[indice_device])).id_vehiculo,
                   placa: JSON.parse(JSON.stringify(this.lista_dispositivos_usuario[indice_device])).placa,
                   //fecha :String(  formatDate(position.deviceTime, 'dd/MM/yyyy ', 'en-US') + ' ' + hora.toLocaleTimeString()),
                   motor: ((position.attributes.ignition==false)?'Apagado':'Encendido'),
                   bateria: (position.attributes.power)? (position.attributes.power.toFixed(1))+' V' : position.attributes.batteryLevel+'%'
                 });
             this.results=this.lista_dispositivos;
            // console.log(position);

            
            // marker = new DriftMarker(this.marker, icon);
            // this.markers[position.deviceId] = marker;

            if(position.attributes.ignition==false){
                this.markers[position.deviceId] = new DriftMarker([position.latitude, position.longitude], this.icono_rojo);
              }else{
                this.markers[position.deviceId] = new DriftMarker([position.latitude, position.longitude], this.icon);
              }



            
            this.markers[position.deviceId] = this.markers[position.deviceId];
            this.markers[position.deviceId].setRotationAngle(position.course);
            //console.log("ver posiciones ",position);
            

            this.markers[position.deviceId].bindPopup("<div style='font-size: 8px' > " +
              "<b>Placa :</b>  " + JSON.parse(JSON.stringify(this.lista_dispositivos_usuario[indice_device])).placa + '<br/>' +
              "<b>Velocidad :</b>  " + (position.speed * 1.852).toFixed(1) + ' Km/h<br/>' +
              (position.deviceTime != null ? '<b>Fecha :</b> ' + formatDate(position.deviceTime, 'dd/MM/yyyy ', 'en-US') + ' ' + hora.toLocaleTimeString() + '<br/>' : '') +
              (position.attributes.batteryLevel != null ? '<b>Bat gps :</b> ' + parseFloat(position.attributes.batteryLevel).toFixed(1) + '%<br/>' : '') +
              (position.attributes.battery != null ? '<b>Bat gps :</b> ' + parseFloat(position.attributes.battery).toFixed(1) + ' Volt.<br/>' : '') +
              (position.attributes.power != null ? '<b>Bat vehículo :</b> ' + parseFloat(position.attributes.power).toFixed(1) + ' Volt.<br/>' : '') +
              (position.address != null ? '<b>Ubicación</b><br/> ' + position.address : '') +
              "<div> ");


              this.markers[position.deviceId].addTo(this.map);

            //console.log("actualizando1");

          } else {


            this.markers[position.deviceId].slideCancel(); 

            var icon_aux = this.markers[position.deviceId].options.icon;       
            icon_aux.options.iconUrl =((position.attributes.ignition==false)?'./assets/icono/marcadores/circulo/ubi_rojo.png':'./assets/icono/marcadores/circulo/ubi_azul.png'); 
            this.markers[position.deviceId].setIcon(icon_aux);

            //console.log("actualizando2");
            
            this.markers[position.deviceId].setRotationAngle(position.course);

            this.markers[position.deviceId].slideTo([position.latitude, position.longitude], {
              duration: 5000,
              keepAtCenter: (this.vehiculo_seleccionado.id_dispositivo==position.deviceId)?true:false,
            });

            //editar marker para lista de dispositivos
            let indice_lista_dispositivo = this.lista_dispositivos.findIndex(device => JSON.parse(JSON.stringify(device)).id_dispositivo === position.deviceId);
            this.lista_dispositivos[indice_lista_dispositivo].lat=position.latitude;
            this.lista_dispositivos[indice_lista_dispositivo].lng=position.longitude;
            this.lista_dispositivos[indice_lista_dispositivo].motor =((position.attributes.ignition==false)?'Apagado':'Encendido');
            this.lista_dispositivos[indice_lista_dispositivo].bateria= (position.attributes.power)? (position.attributes.power.toFixed(1))+' V' : position.attributes.batteryLevel+'%';
            

            this.markers[position.deviceId].bindPopup("<div style='font-size: 8px' > " +
              "<b>Placa :</b>  " + JSON.parse(JSON.stringify(this.lista_dispositivos_usuario[indice_device])).placa + '<br/>' +
              "<b>Velocidad :</b>  " + (position.speed * 1.852).toFixed(1) + ' Km/h<br/>' +
              (position.deviceTime != null ? '<b>Fecha :</b> ' + formatDate(position.deviceTime, 'dd/MM/yyyy ', 'en-US') + ' ' + hora.toLocaleTimeString() + '<br/>' : '') +
              (position.attributes.batteryLevel != null ? '<b>Bat gps :</b> ' + parseFloat(position.attributes.batteryLevel).toFixed(1) + '%<br/>' : '') +
              (position.attributes.battery != null ? '<b>Bat gps :</b> ' + parseFloat(position.attributes.battery).toFixed(1) + ' Volt.<br/>' : '') +
              (position.attributes.power != null ? '<b>Bat vehículo :</b> ' + parseFloat(position.attributes.power).toFixed(1) + ' Volt.<br/>' : '') +
              (position.address != null ? '<b>Ubicación</b><br/> ' + position.address : '') +
              "<div> ");


              this.map.dragging.enable();//Activa movimiento del mapa despues de la animacion
              
          }
        }
        //// fi nuevo codigo


      }
      this.lista_dispositivos_aux=this.lista_dispositivos;
      // console.log("ver datos ",this.lista_dispositivos);
      
       if(this.bandera_centrado_mapa==false){
         this.bandera_centrado_mapa=true;
         this.map.fitBounds(this.lista_dispositivos);
       }
        
      
    }


  }
  clear(table: Table) {
    table.clear();
  }
  SeleccionarVehiculo(item:any){

    this.hide_botones=false;
    this.borrarMarcadores();
    this.lista_viajes=[];
    this.style_map= 'map_tiempo_real';
    this.bandera_tabla_viaje=true;
    if(this.polylines){
      this.polylines.removeFrom(this.map);
    }
    // this.nombre_placa=item.placa;
    //similar a la funcion centar mapa
    this.map.closePopup();

    let id=item.id_dispositivo;
    this.vehiculo_seleccionado=item;
    
    //nos dirigimos hacia el marker
    let p=this.markers[id];
    if(this.id_vehiculo_aux==item.id_dispositivo){
      this.map.setView([p._latlng.lat, p._latlng.lng])
    }
    else{
      this.map.setView([p._latlng.lat, p._latlng.lng], 16);
      this.id_vehiculo_aux=item.id_dispositivo;
    }

    //abrimos el popop
    this.markers[id].openPopup();
    
  }
  aplicar_filtros(){
    //this.contador_zoom_mapa=0;

    this.lista_viajes=[];
    this.visibleSidebar1=false;
    if(this.tipo_monitoreo_seleccionado.code=='rutas'){
      // this.bandera_timer=false;
      if(!this.fecha_ratreo){
        this.error('Error','El campo fecha es requerido');
      }else{
        if(!this.hora_inicio){
          this.error('Error','El campo hora inicio es requerido');
        }else{
          if(!this.hora_fin){
            this.error('Error','El campo hora fin es requerido');
          }else{
            // this.loading_alert();
            this.ejecutar_filtros();
            this.visibleSidebar1=false;
          }
        }
      }
    }
    if(this.tipo_monitoreo_seleccionado.code=='viajes'){
      this.ejecutar_filtros();
    }

    this.visibleSidebar1=false;
    
  

    
  }
  ejecutar_filtros(){
    let lista_vehiculos:any= JSON.parse(JSON.stringify(this.vehiculo_seleccionado));
    let id_vehiculos_seleccionados= this.vehiculo_seleccionado.id_vehiculo+"";
    let contador:any=0;
   
    console.log("ver tipo monitoreo ",this.tipo_monitoreo_seleccionado.code);

     if(this.tipo_monitoreo_seleccionado.code=='viajes'){
       this.GetViajes();
     }
    if(this.tipo_monitoreo_seleccionado.code=='rutas'){
      this.loading_alert();


      let f_ini='';
      let f_fin='';

      f_ini=formatDate(this.fecha_ratreo, 'yyyy/MM/dd', 'en-US')+' '+this.hora_inicio.toLocaleTimeString();
      f_fin=formatDate(this.fecha_ratreo, 'yyyy/MM/dd', 'en-US')+' '+this.hora_fin.toLocaleTimeString();

      console.log("nueva fecha inicio ",f_ini);
      console.log("nueva fecha final ",f_fin);


      this.monitoreo_servicio.post_monitoreo_rutas({id_vehiculos:id_vehiculos_seleccionados,fecha_inicio:f_ini,fecha_fin:f_fin}).subscribe(data=>{
        this.closeLoading_alert();
         
        this.AgregarMarcadorRutas( JSON.parse(JSON.stringify(data)));
      },
      error=>{
        this.closeLoading_alert();
        console.log("ver errores ",error);
      })
    }
  }
  AgregarMarcadorRutas(marcadores:any){

    let lista_dispositivos = new Array(); //para centrar mapa segun rutas
    this.map.closePopup();
    this.borrarMarcadores();
    this.lista_marcadores=[];

    let linea_rutas=[];
    let lat:any;
    let lon:any;
    let contador:any=0;
    let icon:any;

    for (let indice of marcadores.lista_monitoreo_tiempo_real ){
      
        contador++;
        if(contador==1){

            // icon = {
            //   icon: L.icon({
            //     iconSize: [25, 31],
            //     iconAnchor: [12, 31],
            //     iconUrl: './assets/icono/marcadores/ubicacion/ubi-rojo.svg',
            //   })
            // };
            icon=this.icono_inicio;
          

        }else{
          if(contador==marcadores.lista_monitoreo_tiempo_real.length){
            // icon = {
            //   icon: L.icon({
            //     iconSize: [25, 31],
            //     iconAnchor: [12, 31],
            //     iconUrl: './assets/icono/marcadores/ubicacion/ubi-azul.svg',
            //   })
            // };
            icon=this.icono_final;
          }else{
            if(indice.tiempo_parqueo=='00:00:00'){
              icon = {
                icon: L.icon({
                  // iconSize: [20, 8],
                  // iconAnchor: [7, 3],
                  iconSize: [8, 10],
                  iconAnchor: [4, 3],
                  iconUrl: './assets/icono/marcadores/flecha/flecha-azul2.svg',
                }),
                rotationAngle:indice.course
              };
            }
            else{
              icon = {
                icon: L.icon({
                  iconSize: [25, 31],
                  iconAnchor: [12, 31],
                  iconUrl: './assets/icono/marcadores/ubicacion/ubi-amarillo.svg'
                })
              };
            }

          }
        }

        if(indice.tiempo_parqueo=='00:00:00'){
          this.marker = L.marker([indice.latitude, indice.longitude], icon).addTo(this.map);
          this.marker.bindPopup("<div font-size: 10px; z-index:1000' > <div style='text-align: center;' > <b>DATOS DEL MOTORIZADO</b></div><br/>"+
          "<b>Placa :</b>  "+indice.placa+
          " <br> <b>Fecha :</b>  "+indice.devicetime+
          " <br> <b>Velocidad :</b>  "+parseFloat(indice.speed).toFixed(2)+" Km/h"+
          " <br> <b>Bateria :</b>  "+parseFloat(indice.bateria_vehiculo).toFixed(2)+" Volt."+
          " <br> <b>Ubicación :</b> </br>"+indice.address+ 
          "<div> ");
        }else{
          this.marker = L.marker([indice.latitude, indice.longitude], icon).addTo(this.map);
          this.marker.bindPopup("<div font-size: 10px; z-index:1000' > <div style='text-align: center;' > <b>DATOS DEL MOTORIZADO</b></div><br/>"+
          "<b>Placa :</b>  "+indice.placa+
          " <br> <b>Fecha :</b>  "+indice.devicetime+
          " <br> <b>Velocidad :</b>  "+parseFloat(indice.speed).toFixed(2)+" Km/h"+
          " <br> <b>Bateria :</b>  "+parseFloat(indice.bateria_vehiculo).toFixed(2)+" Volt."+
          " <br> <b>Tiempo parqueo :</b>  "+indice.tiempo_parqueo+
          " <br> <b>Ubicación :</b> </br>"+indice.address+ 
          "<div> ");
        }

        lista_dispositivos.push(
          {
             lat:indice.latitude,
             lng:indice.longitude,
          });
        
        this.lista_marcadores.push(this.marker);

        linea_rutas.push(this.marker.getLatLng());
        lat=indice.latitude;
        lon=indice.longitude;


    }

    if(this.polylines){
      this.polylines.removeFrom(this.map);
    }

    if(linea_rutas.length>0){


        this.polylines = L.polyline(linea_rutas, {
          color: '#58ACFA', // color de linea
          // weight: 7, // grosor de línea
          weight: 6, // grosor de línea
        }).addTo(this.map);
        
        this.map.fitBounds(lista_dispositivos);
      
      // if(this.contador_zoom_mapa==0){
      //   this.map.setView([lat, lon], 16);  
      // }else{
      //   this.map.setView([lat, lon]);  
      // }
  
      
    }else{
      // this.BorrarToast();
      // this.messageService.add({severity: 'info', summary: 'Mensaje', detail: 'No existe datos en la fecha' });
    }

    //solucion a problema de boton close de popop
    document.querySelector('.leaflet-pane.leaflet-popup-pane')!.addEventListener('click', event => {
      event.preventDefault();
    });
  }
  abrir_filtros(datos:string,item:any){

    this.SeleccionarVehiculo(item);//evento para copiar al seleccionado de vehiculo
    
    
    this.tipo_monitoreo_seleccionado.code=datos;
    if(this.tipo_monitoreo_seleccionado.code=="rutas"){
      // this.limite_seleccion_vehiculos=1;
      // this.bandera_tipo_monitoreo=false;

      this.bandera_fecha_ratreo=false;
      this.bandera_fecha_inicio=true;
      this.bandera_fecha_final=true;
      this.bandera_hora_inicio=false;
      this.bandera_hora_fin=false;

      this.style_map = 'map_tiempo_real';
      this.bandera_tabla_viaje=true;
      this.lista_viajes=[];

    }
    if(this.tipo_monitoreo_seleccionado.code=="viajes"){
      // this.limite_seleccion_vehiculos=1;
      // this.bandera_tipo_monitoreo=false;
      console.log("llego  ",this.tipo_monitoreo_seleccionado.code);
      this.bandera_fecha_ratreo=true;
      this.bandera_fecha_inicio=false;
      this.bandera_fecha_final=false;
      this.bandera_hora_inicio=true;
      this.bandera_hora_fin=true;

      this.style_map = 'map_viaje';
      this.bandera_tabla_viaje=false;
      this.lista_viajes=[];

    }

    // this.contador_zoom_mapa=0;
    this.visibleSidebar1=true;
    

  }
  error(titulo:string,mensaje:string){
    Swal.fire({
      icon: 'error',
      title: titulo,
      text: mensaje,
      didClose:() =>{
        this.visibleSidebar1=true;
      }
    });
  }
  closeLoading_alert(){
    Swal.close();
  }
  //viajes
  seleccionar_viaje(viaje:any){
    console.log("ver seleccionar ",viaje,viaje.deviceId);
    this.loading_alert();
    this.GetRutasTraccar(viaje);
  }
  GetRutasTraccar(viaje:any){

    let f_ini='';
    let f_fin='';
    
    // f_ini=formatDate(viaje.startTime, 'yyyy/MM/dd hh:mm:ss', 'en-US');
    // f_fin=formatDate(viaje.endTime , 'yyyy/MM/dd hh:mm:ss', 'en-US');

    // f_ini= new Date(f_ini).toISOString();
    // f_fin= new Date(f_fin).toISOString();

    f_ini= moment(viaje.startTime).toISOString();
    f_fin= moment(viaje.endTime).toISOString(); 
    
   
    // console.log("juan moment ",viaje.deviceId,f_ini,f_fin);
    
    this.traccar.get_rutas(viaje.deviceId,f_ini,f_fin).subscribe( data=>{
          // console.log("datos rutas traccar " ,JSON.parse( JSON.stringify(data))  );
          this.closeLoading_alert();
          let lista_rutas_traccar=JSON.parse( JSON.stringify(data));
          //this.lista_viajes=JSON.parse( JSON.stringify(data));
          this.DibujarRutaTraccar(lista_rutas_traccar);
        },
        error=>{
          console.log("errores ",error);
          this.closeLoading_alert();

        })
  }
  DibujarRutaTraccar(lista_rutas_traccar:any){
    this.borrarMarcadores();
    this.map.closePopup();
    this.lista_marcadores=[];

    let linea_rutas=[];
    // let lat:any;
    // let lon:any;
    let contador:any=0;
    let icon:any;

    let lista_dispositivos = new Array(); //para centrar mapa segun rutas

    for (let indice of lista_rutas_traccar ){
      
        contador++;

        //nueva logiaca
        if(contador==1){
          icon =this.icono_inicio;
        }else{
          if(contador==lista_rutas_traccar.length){
            icon =this.icono_final;
          }
          else{
            icon = {
              icon: L.icon({
                // iconSize: [20, 8],
                // iconAnchor: [7, 3],
                iconSize: [8, 10],
                iconAnchor: [4, 3],
                iconUrl: './assets/icono/marcadores/flecha/flecha-azul2.svg',
              }),
              rotationAngle:indice.course
            };
          }
        }
        ////fin nueva logica



        lista_dispositivos.push(
          {
             lat:indice.latitude,
             lng:indice.longitude,
          });
          
        
        //console.log("ver atributes ",indice.attributes.motion);
        this.marker = L.marker([indice.latitude, indice.longitude], icon).addTo(this.map);
        this.marker.bindPopup("<div style='font-size: 8px' > "+
        // "<b>Placa :</b>  "+indice.placa+
        " <b>Fecha :</b>  "+moment(indice.deviceTime).format("DD-MM-YYYY HH:mm:ss")+
        " <br> <b>Velocidad :</b>  "+parseFloat((Number(indice.speed)*1.852).toFixed(2)+'')+" Km/h"+
        " <br> <b>Bateria vehículo :</b>  "+parseFloat(indice.attributes.power).toFixed(2)+" Volt."+
        " <br> <b>Bateria Gps:</b>  "+parseFloat(indice.attributes.battery).toFixed(2)+" Volt."+
        " <br> <b>Motor:</b>  "+((indice.attributes.ignition==true)?' Encendido':' Apagado')+
        " <br> <b>Movimiento:</b>  "+((indice.attributes.motion==true)?' Si':' No')+
        // " <br> <b>Grados de giro:</b>  "+indice.course+
        " <br> <b>Latitud:</b>  "+indice.latitude+
        " <br> <b>Longitud:</b>  "+indice.longitude+
        // " <br> <b>Giro:</b>  "+indice.course+
        " <br> <b>Altitud:</b>  "+indice.altitude+
        " <br> <b>Odometro:</b>  "+ parseFloat((Number(indice.attributes.odometer)/1000)+'').toFixed(2)+" Km"+
        // " <br> <b>Ubicación :</b> </br>"+indice.address+ 
        "<div> "); 

        if(contador==1){
          this.marker.bindTooltip("Inicio");
          // this.marker.openTooltip();
        }
        if(contador==lista_rutas_traccar.length){
          this.marker.bindTooltip("Final");
          // this.marker.openTooltip();
        }
        
        this.lista_marcadores.push(this.marker);

        linea_rutas.push(this.marker.getLatLng());
        // lat=indice.latitude;
        // lon=indice.longitude;


    }

    if(this.polylines){
      this.polylines.removeFrom(this.map);
    }

    if(linea_rutas.length>0){

      

      this.polylines = L.polyline(linea_rutas, {
        color: '#58ACFA', // color de linea
        // weight: 7, // grosor de línea
        weight: 6, // grosor de línea
      }).addTo(this.map);
      
      this.map.fitBounds(lista_dispositivos);
      
      // this.map.setView([lat, lon]), 16,{ animation: true };  
      
      // this.contador_zoom_mapa++;
      
    }

    //solucion a problema de boton close de popop
    document.querySelector('.leaflet-pane.leaflet-popup-pane')!.addEventListener('click', event => {
      event.preventDefault();
    });
  }
  GetViajes(){
    this.loading_alert();
    // let lista_vehiculos:any= JSON.parse(JSON.stringify(this.vehiculo_seleccionado));
    let id_vehiculos_seleccionados=this.vehiculo_seleccionado.id_dispositivo;
    // let contador:any=0;

    let f_ini='';
    let f_fin='';

    if(this.tipo_monitoreo_seleccionado.code=='viajes'){
      f_ini=formatDate(this.fecha_inicio, 'yyyy/MM/dd hh:mm:ss', 'en-US');
      f_fin=formatDate(this.fecha_final, 'yyyy/MM/dd hh:mm:ss', 'en-US');
    }

    // for (let clave of lista_vehiculos){
    //   contador++;
    //   if(contador==lista_vehiculos.length){
    //     id_vehiculos_seleccionados=clave.id_dispositivo; 
    //   }
    // }

    let localTimeZone = moment.tz.guess(); 
    let localTimeZoneCode = moment().tz(localTimeZone).format('z');

    // f_ini= moment((moment(this.fecha_inicio).tz(localTimeZone).utcOffset() / 60).toString()).toISOString(true);

    f_ini= moment(this.fecha_inicio).format();
    f_fin= moment(this.fecha_final).format();
    // f_fin= moment((moment(this.fecha_final).tz(localTimeZone).utcOffset() / 60).toString()).toISOString(true); 
    console.log("parametros fechas ",f_ini,f_fin);
    
    this.traccar.get_viajes(id_vehiculos_seleccionados,f_ini,f_fin).subscribe( data=>{
          
          console.log("datos viajes " ,JSON.parse( JSON.stringify(data))  );
          this.closeLoading_alert();
          this.lista_viajes=JSON.parse( JSON.stringify(data));
          let lista_temporal=Array();
          for (let index = 0; index < this.lista_viajes.length; index++) {
            
            
            lista_temporal.push(JSON.parse(JSON.stringify(this.lista_viajes[index])));
            let duration =JSON.parse(JSON.stringify(this.lista_viajes[index]));

            //let aux=JSON.parse(JSON.stringify(this.lista_viajes[index])).duration;
            let ini = moment(duration.startTime);
            let fin =moment( duration.endTime);

            // console.log('DURATION:', ini,fin);
            // console.log('horas:', fin.diff(ini, 'hours'));
            // console.log('minutos:', fin.diff(ini, 'minutes'));
            // console.log('Segundos:', fin.diff(ini, 'seconds'));
            lista_temporal[index].duration=fin.diff(ini, 'hours')+' h '+fin.diff(ini, 'minutes')+' m ';

            // console.log("lista  duration ", durationA);
            
          }
          this.lista_viajes=lista_temporal;

        },
        error=>{
          console.log("errores ",error);
          this.closeLoading_alert();

        })
  }
  loading_alert(){
    Swal.fire({
      title: 'Espere un momento por favor',
      html: 'Cargando',
      allowOutsideClick: false,
      didOpen: () => {
          Swal.showLoading()
      },
    }); 
  }
}
