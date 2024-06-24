import { Component,AfterViewInit ,NgZone, OnDestroy } from '@angular/core';
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
//import * as moment from 'moment';
import 'moment-timezone';
import { ErrorHandler } from '@angular/core';
import { Router } from '@angular/router';
//moment.locale("es");
//import { LuxonModule } from 'luxon-angular';
import { DateTime, IANAZone } from 'luxon';
// instalar luxon npm i --save-dev @types/luxon




@Component({
  selector: 'app-monitoreo-google',
  templateUrl: './monitoreo-google.component.html',
  styleUrls: ['./monitoreo-google.component.css'],
  providers: [MessageService]
})
export class MonitoreoGoogleComponent implements AfterViewInit  ,OnDestroy ,ErrorHandler{

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

  token:string ='jlUTEjCCKDUFyTIbT6GLwg0IWwsNArcL';
  contador_error=0;
  public results:any;
  
  icon: any;
  icono_rojo :any;
  icono_inicio :any;
  icono_final :any;
  icono_parqueo:any;
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
  fecha_ratreo: any=this.getCurrentTime().toJSDate() //new Date();


  //fiaux =(new Date().getFullYear())+'-'+(new Date().getMonth()+1)+'-01';
  //ffaux =(new Date().getFullYear())+'-'+(new Date().getMonth()+1)+'-'+(new Date().getDate());
  fecha_inicio:any=this.getStartOfMonth().toJSDate(); // new Date(this.fiaux);
  fecha_final:any=this.getCurrentTime().toJSDate(); //new Date(this.ffaux);


  hora_inicio=this.fecha_inicio;
  hora_fin=this.fecha_final;

  bandera_fecha_ratreo:boolean=false;
  bandera_fecha_inicio:boolean=false;
  bandera_fecha_final:boolean=false;
  bandera_hora_inicio:boolean=false;
  bandera_hora_fin:boolean=false;
  tipo_monitoreo_seleccionado ={code:''};

  lista_viajes :Array<String>=[];
  lista_parqueos :Array<String>=[];
  style_map :String = 'map_tiempo_real';
  bandera_tabla_viaje:boolean=true;
  lista_centrado_parqueo=new Array();
  bandera_tabla_parqueo:boolean=true;
  bandera_tabla_rutas:boolean=true;

  //viajes
  selected_item:Array<String>=[]

  seguimiento_marcador=0;

  lista_rutas_traccar:Array<String>=[];

  isVehicleListVisible = false;

  // map: L.Map | undefined;
  osm: L.TileLayer;
  googleStreets: L.TileLayer;
  googleHybrid: L.TileLayer;
  customControl: L.Control | undefined;
  customMapControl: L.Control | undefined;

  baseLayers!: L.TileLayer[];
  currentLayerIndex: number = 0;
  
  titulo_filtro:String='';

  checked_parqueo: boolean = false;



  
  constructor(
    private traccar:TraccarService,
    private monitoreo_servicio:MonitoreoService,
    private cookieService: CookieService,
    private router: Router, 

  ) {

    this.osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '',
    });

    this.googleStreets = L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',{
      maxZoom: 20,
      subdomains:['mt0','mt1','mt2','mt3']
    });

    this.googleHybrid = L.tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}',{
      maxZoom: 20,
      subdomains:['mt0','mt1','mt2','mt3']
    });
    this.baseLayers = [this.osm, this.googleStreets, this.googleHybrid];
   }
  async ngAfterViewInit(): Promise<void> {

    //this.fecha_inicio.setHours(0,0,0);
    //this.fecha_final.setHours(23,59,59);


    this.token = await this.getToken();
    
    if(this.token!=undefined){

      this.cargarIcono();
      this.IniciarMapa();
  
      this.lista_dispositivos_usuario = JSON.parse(localStorage.getItem('accesos') || '{}').Vehiculo;
      this.InicarSesion();
      this.loading_alert();
      this.reconecta();
    }else{
      this.error("Información","Vuelva a iniciar sesión");
      localStorage.removeItem("accesos");
      this.router.navigate(['/shared/slider']);   
    }
  }
  toggleVehicleList() {
    this.isVehicleListVisible = !this.isVehicleListVisible;
    // Actualizar el texto del botón según el estado
    const button = document.querySelector('.toggle-button');
    if (button) {
      // button.innerHTML = this.isVehicleListVisible ? '<i class="pi pi-times"></i> Hide Table' : '<img src="assets/icono/botones/icon-ruta.png" class="custom-icon"> Show Table';
      button.innerHTML = this.isVehicleListVisible ? '<i class="pi pi-times"></i>' : '<img src="assets/icono/botones/icon-ruta.png" class="custom-icon">';
    }
  }
  getStartOfMonth(): DateTime {
    return DateTime.now().startOf('month').startOf('day');
  }
  getCurrentTime(): DateTime {
    return DateTime.now().endOf('day');
  }
  handleError(error: any): void {//para errores de bondle
    const chunkFailedMessage = /Loading chunk [\d]+ failed/;
  
      if (chunkFailedMessage.test(error.message)) {
        window.location.reload();
      }
  }
  async getToken(){

    return JSON.parse(localStorage.getItem('accesos') || '{}').token_socket;
  }
  // async ngOnInitInit (): Promise<void> {

 
    
  // }
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

        iconSize:     [35, 41],
        iconAnchor:   [1, 39], //vertical  
        popupAnchor:  [-0, -47] 

        // iconSize: [30, 35],
        // iconAnchor: [17, 17],
        // popupAnchor: [0, -13] //horizontal  vertical
      })
    };
    this.icono_parqueo ={
      icon: L.icon({
        iconUrl: './assets/icono/marcadores/circulo/parqueo.png',
        // iconSize: [30, 35],
        // iconAnchor: [17, 17],
        // popupAnchor: [0, -13] //horizontal  vertical
        iconSize:     [20, 41],
        iconAnchor:   [1, 39], //vertical  
        popupAnchor:  [10, -37] //   ,abajo menor numero
      })
    };
  }

   InicarSesion(){
     //let token='jlUTEjCCKDUFyTIbT6GLwg0IWwsNArcL';
     this.traccar.post_iniciar_sesion(this.token).subscribe( data=>{
      //  console.log( JSON.parse( JSON.stringify(data))  );
      


     },
     error=>{
       
     })
   }
  
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

        this.error("Información","Vuelva a iniciar sesión");
        //localStorage.removeItem("accesos");
        //this.router.navigate(['/shared/slider']);   
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
    this.map = L.map('map2', {
      center: [-16.6574403011881, -64.95190911770706],
      zoom: 5,
      fadeAnimation: false,
      zoomAnimation: false,
      markerZoomAnimation: false,
      attributionControl: false,
      renderer: L.canvas()
    });

    this.osm.addTo(this.map);

   

    // Ajustar el tamaño del mapa cuando la ventana cambie de tamaño
    this.map.on('resize', () => {
      this.map?.invalidateSize();
    });

    // Agregar botón extra y botón de tipo de mapa
    setTimeout(() => {
      this.map?.invalidateSize();

      this.agregarBotonVehiculo();
      this.agregarBotonTipoMapa();
      this.removeDefaultLayersControl();
      //this.agregaBotonTipoMapa2();

    }, 1000);

    var mapaBase = {
      'Osm': this.osm,
      'Google Calles': this.googleStreets,
      'Google Hibrido': this.googleHybrid
    };

    var controlCapas = L.control.layers(mapaBase);
    controlCapas.addTo(this.map);

    var controlEscala = L.control.scale();
    controlEscala.addTo(this.map);

    // Solucionar problema del botón close de popup
    try {
      document.querySelector('.leaflet-pane.leaflet-popup-pane')!.addEventListener('click', event => {
        event.preventDefault();
      });
    } catch (error) {
      console.error('Error al intentar solucionar el problema del botón close de popup:', error);
    }
  }
agregarBotonTipoMapa(){
  const customButton = L.DomUtil.create('div', 'custom-leaflet-control color-icono-tipo-mapa');
  customButton.style.backgroundColor = '#28a745'; // Color de fondo del botón
  customButton.style.border = 'none'; // Quitar cualquier borde
  customButton.style.borderRadius = '50%'; // Forma circular
  customButton.style.width = '40px'; // Ancho del botón
  customButton.style.height = '40px'; // Alto del botón
  customButton.style.cursor = 'pointer';
  customButton.style.position = 'absolute'; // Posición absoluta para colocar en la esquina
  customButton.style.left = '10px'; // Ajuste de posición para colocar a la izquierda
  customButton.style.top = '145px'; // Ajuste de posición para colocar debajo del botón de zoom
  customButton.title = 'Tipo de mapa';

  const icon = L.DomUtil.create('img', 'custom-icon', customButton);
  icon.src = 'assets/icono/botones/tipo-mapa.png'; // Ruta de tu icono personalizado
  // icon.style.width = '20px'; // Ancho del icono
  // icon.style.height = '20px'; // Alto del icono
  icon.style.margin = 'auto'; // Centrar el icono dentro del contenedor

  L.DomEvent.on(customButton, 'click', (e) => {
        // Cambiar entre las capas base
        // if (this.map.hasLayer(this.osm)) {
        //   this.map.removeLayer(this.osm);
        //   this.map.addLayer(this.googleStreets); 
        // } else {
        //   this.map.removeLayer(this.googleStreets);
        //   this.map.addLayer(this.osm);
        // }
        this.changeBaseLayer();
  });

  this.map.getContainer().appendChild(customButton); 

  
}
changeBaseLayer(): void {
  this.map.removeLayer(this.baseLayers[this.currentLayerIndex]);
  this.currentLayerIndex = (this.currentLayerIndex + 1) % this.baseLayers.length;
  this.map.addLayer(this.baseLayers[this.currentLayerIndex]);
}
agregarBotonVehiculo(){

  const customButton = L.DomUtil.create('div', 'custom-leaflet-control color-icono-vehiculo');
  customButton.style.backgroundColor = '#28a745'; // Color de fondo del botón
  customButton.style.border = 'none'; // Quitar cualquier borde
  customButton.style.borderRadius = '50%'; // Forma circular
  customButton.style.width = '40px'; // Ancho del botón
  customButton.style.height = '40px'; // Alto del botón
  customButton.style.cursor = 'pointer';
  customButton.style.position = 'absolute'; // Posición absoluta para colocar en la esquina
  customButton.style.left = '10px'; // Ajuste de posición para colocar a la izquierda
  customButton.style.top = '100px'; // Ajuste de posición para colocar debajo del botón de zoom
  customButton.title = 'Lista de vehículos';

  const icon = L.DomUtil.create('img', 'custom-icon', customButton);
  icon.src = 'assets/icono/botones/vehiculo.png'; // Ruta de tu icono personalizado
  // icon.style.width = '20px'; // Ancho del icono
  // icon.style.height = '20px'; // Alto del icono
  icon.style.margin = 'auto'; // Centrar el icono dentro del contenedor

  L.DomEvent.on(customButton, 'click', (e) => {
    this.toggleVehicleList();
    L.DomEvent.stopPropagation(e);
  });

  this.map.getContainer().appendChild(customButton); 

}
removeDefaultLayersControl() {
  // Buscar y eliminar el control de capas por defecto
  const layersControl = document.getElementsByClassName('leaflet-control-layers')[0];
  if (layersControl) {
    layersControl.remove();
  }
}

//este metodo esta siendo invocado por leaflet para en este caso borrar icono de tipo de mapa (en este componenete no se esta invocando)
toggleMapLayer() {
  if (!this.map) {
    return;
  }

  // Cambiar entre las capas base
  if (this.map.hasLayer(this.osm)) {
    this.map.removeLayer(this.osm);
    this.googleStreets.addTo(this.map);
  } else {
    this.map.removeLayer(this.googleStreets);
    this.osm.addTo(this.map);
  }
}
agregaBotonTipoMapa2() {
  // Crear un control personalizado extendiendo de L.Control
  const CustomControl = L.Control.extend({
    onAdd: (map: L.Map) => {
      // Crear el contenedor del botón
      const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');
      
      // Crear el botón dentro del contenedor
      const button = document.createElement('button');
      button.innerHTML = ''; // Puedes cambiar esto por un icono si lo deseas
      button.title = 'Cambiar tipo de mapa';
      button.style.backgroundColor = '#007BFF';
      button.style.color = 'white';
      button.style.border = 'none';
      button.style.borderRadius = '50%';
      button.style.width = '40px';
      button.style.height = '40px';
      button.style.cursor = 'pointer';
      button.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.2)';
      button.style.display = 'flex';
      button.style.justifyContent = 'center';
      button.style.alignItems = 'center';


      // Crear el icono dentro del botón
      const icon = L.DomUtil.create('img', 'custom-icon', button);
      icon.src = 'assets/icono/botones/icon-viaje.png'; // Ruta de tu icono personalizado
      icon.style.width = '40px'; // Ancho del icono
      icon.style.height = '40px'; // Alto del icono
      icon.style.margin = 'auto'; // Centrar el icono dentro del contenedor
      icon.style.padding='7px';
      // Evento click del botón
      button.addEventListener('click', () => {
        // Cambiar entre las capas base
        if (map.hasLayer(this.osm)) {
          map.removeLayer(this.osm);
          map.addLayer(this.googleStreets);
        } else {
          map.removeLayer(this.googleStreets);
          map.addLayer(this.osm);
        }
      });

      // Agregar el botón al contenedor
      container.appendChild(button);

      return container;
    },

    // Posicionar el control en la esquina inferior izquierda
    position: 'bottomleft'
  });

  // Instanciar y agregar el control personalizado al mapa
  this.customMapControl = new CustomControl();
  this.customMapControl.addTo(this.map);
}


  borrarMarcadores() {
    if(this.lista_marcadores){
      for (let indice of this.lista_marcadores){
        this.map.removeLayer(indice);
      }
    }
  }
  borraarMarcadorSegunLista(){
    for (let index = 0; index < this.lista_parqueos.length; index++) {

      let lista_temporal=(JSON.parse(JSON.stringify(this.lista_parqueos[index])));
      console.log("parqueos ",lista_temporal);
      
      const marker = this.markers[lista_temporal.positionId];
      
      if (marker) {
        this.map.removeLayer(marker);
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
              keepAtCenter: (this.vehiculo_seleccionado.id_dispositivo==position.deviceId && this.seguimiento_marcador!=0)?true:false,
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
    this.seguimiento_marcador=item.id_dispositivo;

    this.hide_botones=false;
    this.borrarMarcadores();
    this.borraarMarcadorSegunLista();
    this.lista_viajes=[];
    this.lista_parqueos=[];
    this.style_map= 'map_tiempo_real';
    this.bandera_tabla_viaje=true;
    this.bandera_tabla_parqueo=true;
    this.bandera_tabla_rutas=true;
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
  SeleccionarParqueo(item:any){

    this.map.closePopup();  
    //nos dirigimos hacia el marker
    let p=this.markers[item.positionId];
    // this.map.setView([p._latlng.lat, p._latlng.lng], 16);
    //abrimos el popop
    this.markers[item.positionId].openPopup();
    
  }
  aplicar_filtros(){
    //this.contador_zoom_mapa=0;

    this.lista_viajes=[];
    this.lista_parqueos=[];
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
    else if(this.tipo_monitoreo_seleccionado.code=='viajes' || this.tipo_monitoreo_seleccionado.code=='parqueos'){
      this.ejecutar_filtros();
    }

    this.visibleSidebar1=false;
    
  

    
  }
  ejecutar_filtros(){
    let lista_vehiculos:any= JSON.parse(JSON.stringify(this.vehiculo_seleccionado));
    let id_vehiculos_seleccionados= this.vehiculo_seleccionado.id_vehiculo+"";
    let contador:any=0;
    this.map.closePopup();
   
    this.isVehicleListVisible=false;

     if(this.tipo_monitoreo_seleccionado.code=='viajes'){
       this.GetViajes();
     }
     else if(this.tipo_monitoreo_seleccionado.code=='parqueos'){
      this.GetParqueos(this.fecha_inicio,this.fecha_final,this.vehiculo_seleccionado.id_dispositivo);
    }
    else if(this.tipo_monitoreo_seleccionado.code=='rutas'){
      this.loading_alert();


      let f_ini;
      let f_fin;


      this.fecha_ratreo.setHours(DateTime.fromJSDate(this.hora_inicio).hour,DateTime.fromJSDate(this.hora_inicio).minute,0);
      f_ini =DateTime.fromJSDate(this.fecha_ratreo).toISO();
      this.fecha_ratreo.setHours(DateTime.fromJSDate(this.hora_fin).hour,DateTime.fromJSDate(this.hora_fin).minute,59);
      f_fin = DateTime.fromJSDate(this.fecha_ratreo).toISO();
      let id_vehiculos_seleccionados=this.vehiculo_seleccionado.id_dispositivo;


      this.GetRutasTraccar({deviceId:id_vehiculos_seleccionados,startTime:f_ini,endTime:f_fin});

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
  capitalizarTexto(input: string): string {
    return input.charAt(0).toUpperCase() + input.slice(1);
  }
  abrir_filtros(datos:string,item:any){

  this.titulo_filtro = this.capitalizarTexto(datos);
 
//inicio selecion//////////
this.hide_botones=false;
this.borrarMarcadores();
this.borraarMarcadorSegunLista();
this.lista_viajes=[];
this.lista_parqueos=[];
this.lista_rutas_traccar=[];
this.style_map= 'map_tiempo_real';
this.bandera_tabla_viaje=true;
this.bandera_tabla_parqueo=true;
this.bandera_tabla_rutas=true;
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
this.seguimiento_marcador=0;
/////////////////////////
    
    this.tipo_monitoreo_seleccionado.code=datos;
    this.style_map = 'map_tiempo_real';
    if(this.tipo_monitoreo_seleccionado.code=="rutas"){
      // this.limite_seleccion_vehiculos=1;
      // this.bandera_tipo_monitoreo=false;

      this.bandera_fecha_ratreo=false;
      this.bandera_fecha_inicio=true;
      this.bandera_fecha_final=true;
      this.bandera_hora_inicio=false;
      this.bandera_hora_fin=false;

      this.style_map = 'map_viaje';
      this.bandera_tabla_viaje=true;
      this.bandera_tabla_parqueo=true;
      this.bandera_tabla_rutas=false;
      // this.lista_viajes=[];
      // this.lista_parqueos=[];
      // this.lista_rutas_traccar=[];

    }
    if(this.tipo_monitoreo_seleccionado.code=="viajes" || this.tipo_monitoreo_seleccionado.code=="parqueos" ){

      // console.log("llego  ",this.tipo_monitoreo_seleccionado.code);
      this.bandera_fecha_ratreo=true;
      this.bandera_fecha_inicio=false;
      this.bandera_fecha_final=false;
      this.bandera_hora_inicio=true;
      this.bandera_hora_fin=true;

      this.style_map = 'map_viaje';
      this.bandera_tabla_viaje=(this.tipo_monitoreo_seleccionado.code=="viajes" )?false:true;
      this.bandera_tabla_parqueo=(this.tipo_monitoreo_seleccionado.code=="parqueos" )?false:true;
      // this.lista_viajes=[];
      // this.lista_parqueos=[];

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
    // console.log("ver seleccionar ",viaje,viaje.deviceId);
    this.loading_alert();
    this.GetRutasTraccar(viaje);
  }
  seleccionar_ruta(ruta:any){
    
    this.map.closePopup();  
    //nos dirigimos hacia el marker
    let p=this.markers[ruta.id];
    //this.map.setView([p._latlng.lat, p._latlng.lng], 16);
    //abrimos el popop
    this.markers[ruta.id].openPopup();
  }
  convertSpeedToKmh(speed: number): number {
    return speed * 1.852;
  }
  GetRutasTraccar(viaje:any){

    // let f_ini='';
    // let f_fin='';
    
  
    
    //f_ini= moment(viaje.startTime).toISOString();
    //f_fin= moment(viaje.endTime).toISOString(); 
    
     let f_ini = DateTime.fromISO(viaje.startTime).toISO();
     let f_fin = DateTime.fromISO(viaje.endTime).toISO();
   
     
    //  console.log("juan fecha ",viaje);
    
    this.traccar.get_rutas(viaje.deviceId,f_ini,f_fin).subscribe( data=>{
          // console.log("datos rutas traccar " ,JSON.parse( JSON.stringify(data))  );
          this.closeLoading_alert();
          this.lista_rutas_traccar=JSON.parse( JSON.stringify(data));
          this.DibujarRutaTraccar(this.lista_rutas_traccar);

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
          
        // console.log("veeeeerrrr ",indice);
        
        this.marker = L.marker([indice.latitude, indice.longitude], icon).addTo(this.map);
        this.marker.bindPopup("<div style='font-size: 8px' > "+
        " <b>Fecha :</b>  "+DateTime.fromISO(indice.deviceTime).toFormat('dd-MM-yyyy HH:mm:ss')+
        " <br> <b>Velocidad :</b>  "+parseFloat((Number(indice.speed)*1.852).toFixed(2)+'')+" Km/h"+
        " <br> <b>Bateria vehículo :</b>  "+parseFloat(indice.attributes.power).toFixed(2)+" Volt."+
        " <br> <b>Bateria Gps:</b>  "+parseFloat(indice.attributes.battery).toFixed(2)+" Volt."+
        " <br> <b>Motor:</b>  "+((indice.attributes.ignition==true)?' Encendido':' Apagado')+
        " <br> <b>Movimiento:</b>  "+((indice.attributes.motion==true)?' Si':' No')+
        " <br> <b>Latitud:</b>  "+indice.latitude+
        " <br> <b>Longitud:</b>  "+indice.longitude+
        " <br> <b>Altitud:</b>  "+indice.altitude+
        " <br> <b>Odometro:</b>  "+ parseFloat((Number(indice.attributes.odometer)/1000)+'').toFixed(2)+" Km"+
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

        this.markers[indice.id]=this.marker; //ultima modificacion para rutas

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

    let f_ini;
    let f_fin;

    if(this.tipo_monitoreo_seleccionado.code=='viajes'){
      f_ini=formatDate(this.fecha_inicio, 'yyyy/MM/dd hh:mm:ss', 'en-US');
      f_fin=formatDate(this.fecha_final, 'yyyy/MM/dd hh:mm:ss', 'en-US');
    }


    //let localTimeZone = moment.tz.guess(); 
    //let localTimeZoneCode = moment().tz(localTimeZone).format('z');
    let localTimeZone = DateTime.local().zoneName;
    // Obtener el código de la zona horaria local
    let localTimeZoneCode = DateTime.local().toFormat('ZZ');



    // f_ini= moment(this.fecha_inicio).format();
    // f_fin= moment(this.fecha_final).format();
     f_ini = DateTime.fromJSDate(this.fecha_inicio).toISO();
     f_fin = DateTime.fromJSDate(this.fecha_final).toISO();

    console.log("parametros fechas ",f_ini,f_fin);
    
    this.traccar.get_viajes(id_vehiculos_seleccionados,f_ini,f_fin).subscribe( data=>{
          
          console.log("datos viajes " ,JSON.parse( JSON.stringify(data))  );
          this.closeLoading_alert();
          this.lista_viajes=JSON.parse( JSON.stringify(data));
          let lista_temporal=Array();
          for (let index = 0; index < this.lista_viajes.length; index++) {
            
            
            lista_temporal.push(JSON.parse(JSON.stringify(this.lista_viajes[index])));
            let duration =JSON.parse(JSON.stringify(this.lista_viajes[index]));

            // let ini = moment(duration.startTime);
            // let fin =moment( duration.endTime);
            let ini = DateTime.fromISO(duration.startTime);
            let fin = DateTime.fromISO(duration.endTime);

            // console.log('DURATION:', ini,fin);
            // console.log('horas:', fin.diff(ini, 'hours'));
            // console.log('minutos:', fin.diff(ini, 'minutes'));
            // console.log('Segundos:', fin.diff(ini, 'seconds'));

            let diff = fin.diff(ini, ['hours', 'minutes']);

            // Obtener las horas y minutos de la diferencia
            let hours = Math.floor(diff.as('hours'));
            let minutes = diff.as('minutes') % 60;
            
            
            lista_temporal[index].duration=`${hours} h ${Math.floor(minutes)} m`;

            //lista_temporal[index].duration=fin.diff(ini, 'hours')+' h '+fin.diff(ini, 'minutes')+' m ';

            
          }
          this.lista_viajes=lista_temporal;

        },
        error=>{
          console.log("errores ",error);
          this.closeLoading_alert();

        })
  }
  GetParqueos(fecha_inicio:any,fecha_final:any,id_vehiculos_seleccionados:Number){
    this.loading_alert();
   console.log("fff ini ",fecha_inicio);
   console.log("fff fin ",fecha_final);
    // let lista_vehiculos:any= JSON.parse(JSON.stringify(this.vehiculo_seleccionado));
    id_vehiculos_seleccionados=this.vehiculo_seleccionado.id_dispositivo;
    // let contador:any=0;

    let f_ini;
    let f_fin;

    let localTimeZone = DateTime.local().zoneName;
    // Obtener el código de la zona horaria local
    let localTimeZoneCode = DateTime.local().toFormat('ZZ');


    f_ini = DateTime.fromJSDate(fecha_inicio).toISO();
    f_fin = DateTime.fromJSDate(fecha_final).toISO();
    console.log(f_ini,f_fin);
    
    this.traccar.get_parqueo(id_vehiculos_seleccionados,f_ini,f_fin).subscribe( data=>{
          
          this.closeLoading_alert();
          this.lista_parqueos=JSON.parse( JSON.stringify(data));
          let lista_temporal=Array();
          for (let index = 0; index < this.lista_parqueos.length; index++) {
            
            
            lista_temporal.push(JSON.parse(JSON.stringify(this.lista_parqueos[index])));
            let duration =JSON.parse(JSON.stringify(this.lista_parqueos[index]));

            let ini = DateTime.fromISO(duration.startTime);
            let fin = DateTime.fromISO(duration.endTime);

            let diff = fin.diff(ini, ['hours', 'minutes']);

            // Obtener las horas y minutos de la diferencia
            let hours = Math.floor(diff.as('hours'));
            let minutes = diff.as('minutes') % 60;
            
            
            lista_temporal[index].duration=`${hours} h ${Math.floor(minutes)} m`;
            this.AgregarMarcadorParqueo(lista_temporal[index]);

          }
          this.lista_parqueos=lista_temporal;
          this.map.fitBounds(this.lista_centrado_parqueo, {
            padding: [10, 10] // Margen de 50 píxeles en todos los lados
          });

        },
        error=>{
          console.log("errores ",error);
          this.closeLoading_alert();

        })
  }
  AgregarMarcadorParqueo(data: any) {


    this.markers[data.positionId] = new DriftMarker([data.latitude, data.longitude], this.icono_parqueo);

    let ini = DateTime.fromISO(data.startTime);
    let fin = DateTime.fromISO(data.endTime);

    let diff = fin.diff(ini, ['hours', 'minutes']);

    // Obtener las horas y minutos de la diferencia
    let hours = Math.floor(diff.as('hours'));
    let minutes = diff.as('minutes') % 60;
    // let seconds = Math.floor(this.newDuration.as('seconds')) % 60;
    
    
   let duration=`${hours} h ${Math.floor(minutes)} m`;
    
     this.markers[data.positionId].bindPopup("<div style='font-size: 8px' > " +
       "<b>Placa :</b>  " + data.deviceName + '<br/>' +
       "<b>Tiempo parqueo :</b>  "+duration+ '<br/>' +
       "<b>Fecha inicio :</b>  "+DateTime.fromISO(data.startTime).toFormat('dd-MM-yyyy HH:mm:ss')+ '<br/>' +
       "<b>Fecha fin :</b>  "+DateTime.fromISO(data.endTime).toFormat('dd-MM-yyyy HH:mm:ss')+ '<br/>' +
       "<b>Dirección :</b>  "+data.address+ '<br/>' +
       "<div> ");


      this.markers[data.positionId].addTo(this.map);

      this.lista_centrado_parqueo.push(
        {
           lat:data.latitude,
           lng:data.longitude,
        });
      //  if(this.bandera_centrado_mapa==false){
      //    this.bandera_centrado_mapa=true;
      //    this.map.fitBounds(this.lista_dispositivos);
      //  }
        

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
  PrepareComando(evento:String,item:any){

  
    let indice_device = this.lista_dispositivos_usuario.findIndex(device => JSON.parse(JSON.stringify(device)).id_dispositivo === item.id_dispositivo);
    let data = JSON.parse(JSON.stringify(this.lista_dispositivos_usuario[indice_device]))
    console.log("ver ",data);
    if(evento=='desactivar_motor'){
      this.EviarComando(data.id_dispositivo,data.desactivar_motor.trim());
    }
    else if (evento=='activar_motor'){
      this.EviarComando(data.id_dispositivo,data.activar_motor.trim());
    }
    

  }
  EviarComando(id_dispositivo:number,comando:string){
    this.traccar.enviarComandoPersonalizado(id_dispositivo,comando).subscribe( data=>{
          console.log("ver respuesta comando ",data);
          
      
    },
    error=>{
      console.log("errores ",error);
      this.closeLoading_alert();

    })
  }
}
