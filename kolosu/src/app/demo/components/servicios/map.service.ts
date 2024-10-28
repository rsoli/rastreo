// map.service.ts

import { ElementRef, Injectable, ViewChild } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-rotatedmarker';
import DriftMarker from "leaflet-drift-marker";
import { OverlayPanel } from 'primeng/overlaypanel';
// import 'leaflet.markercluster';
import { formatDate } from '@angular/common';
import { DateTime, Duration, IANAZone } from 'luxon';
import{TraccarService} from './traccar.service';
import { DispositivoModelo } from '../modelos/dispositivo-modelo';
import { OverlayPanelDinamicoComponent } from 'src/app/shared/overlay-panel-dinamico/overlay-panel-dinamico.component';
import { BehaviorSubject, Subject } from 'rxjs';
import 'leaflet-routing-machine'; 
import { MessageService } from 'primeng/api';

//para que renonozca los iconos de leaflet
import { Icon } from 'leaflet';
const DefaultIcon = Icon.Default.prototype;
DefaultIcon.options.iconUrl = 'assets/leaflet/images/marker-icon.png';
DefaultIcon.options.iconRetinaUrl = 'assets/leaflet/images/marker-icon-2x.png';
DefaultIcon.options.shadowUrl = 'assets/leaflet/images/marker-shadow.png';

//6.14.17   npm
//node v14.20.0

  // duplicados
  interface RoutePoint {
    id: number;
    latitude: number;
    longitude: number;
    fixTime: string; // Usaremos fixTime como la marca de tiempo
    speed: number;
    attributes: {
      ignition: boolean;
      [key: string]: any; // Otros atributos pueden estar presentes
    };
    [key: string]: any; // Otros atributos pueden estar presentes
  }

//npm install leaflet
//npm install leaflet-routing-machine
//npm install --save-dev @types/leaflet
//npm install --save-dev @types/leaflet-routing-machine


@Injectable({
  providedIn: 'root'
})
export class MapService {
  private map!: L.Map;

  ///cambio de mapa//////////////////
  baseLayers!: L.TileLayer[];
  currentLayerIndex: number = 0;
  //////////////////////////////////
  osm!: L.TileLayer;
  googleStreets!: L.TileLayer;
  googleHybrid!: L.TileLayer;

   markers =new Array();
  // markers: L.Marker[] = [];

  ////////////iconos////////////7
  icon: any;
  icono_rojo :any;
  icono_azul :any;
  icono_inicio :any;
  icono_final :any;
  icono_parqueo:any;
  posicion_azul:any;
  icono_mi_ubicacion_flecha:any;
  icono_mi_ubicacion:any

  icono_amarillo:any;
  icono_plomo:any;
  //variables////////7
  lista_dispositivos_usuario: DispositivoModelo[] = [];
  lista_dispositivos: DispositivoModelo[] = [];
  vehiculo_seleccionado_temporal: DispositivoModelo[] = [];
//   dispositivo:DispositivoModelo;
  selectedMarker: L.Marker | null = null;

  zindez!:number;

  private vehicleOverlay!: OverlayPanelDinamicoComponent;

  routingControl: any = null;  //como llegar hasta
  watchId: number | null = null; // Variable para almacenar el ID del watchPosition
  private ultimaUbicacion: L.LatLng | null = null;  //ultima ubicacion como llegar
  private distanciaRecorrida: number = 0; 
  index_ubicacion_actual=20000;

  overlay_aux_click:any;

  // Recibe la referencia del overlay
  setVehicleOverlay(overlay: OverlayPanelDinamicoComponent) {
    this.vehicleOverlay = overlay;
  }
  // Método para abrir el overlay
  abrirOverlay(event: Event| null) {
    if (event) {
      if (this.vehicleOverlay) {
        this.vehicleOverlay.openOverlay(event);  // Abrir el overlay
      }
    }

  }
  cerrarOverlay(){
    this.overlay_aux_click=null;
    this.vehicleOverlay.closeOverlay();
  }
  private overlayComponent!: OverlayPanelDinamicoComponent;

  // Declarar la bandera para controlar el ajuste de límites
  private boundsAdjusted: boolean = false;
  lista_rutas_traccar:Array<String>=[];
  lista_marcadores:any;
  polylines:any;

  //parqueos
  lista_parqueos:any=[];
  lista_centrado_parqueo =new Array();
  

  private markers_map: L.Marker[] = []; 

  MarkerSeleccionado: L.Marker | null = null; 

  bandera_trazar_como_llegar:boolean=false;
  ///////////////////para emitir mensaje de error en el componente principal//////////////////////////////////
  private errorSubject = new Subject<string>(); // Puedes usar cualquier tipo según el error que manejes
  error$ = this.errorSubject.asObservable();
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////para emitir mensaje de reporte en el mapa//////////////////////////////////
  private ReporteComoLlegarSubject = new Subject<string>(); // Puedes usar cualquier tipo según el error que manejes
  reportComoLlegar$ = this.ReporteComoLlegarSubject.asObservable();
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////
  private tooltips: Map<any, L.Tooltip> = new Map();

  contador_mi_ubicacion_actual=0;

  constructor(
    private traccar:TraccarService
  ) {
  }
  // Método para emitir el error
  emitirError(mensajeError: string) {
    this.errorSubject.next(mensajeError);
  }
  emitirReporteComoLlegar(data: string) {
    this.ReporteComoLlegarSubject.next(data);
  }
  iniciarVariables(){
    let localStorageData = JSON.parse(localStorage.getItem('accesos') || '{}');
    this.lista_dispositivos_usuario = localStorageData.Vehiculo || [];
    this.lista_dispositivos=this.lista_dispositivos_usuario;
    
    this.zindez=10;
  }
  cargarIcono(){
    let marker_azul = this.generateSvgIcon('#0008FF');
    let marker_rojo = this.generateSvgIcon('#DC3545');
    let marker_amarillo = this.generateSvgIcon('#FF8000');
    let marker_plomo = this.generateSvgIcon('#606060');

    this.icono_rojo={
      icon: L.divIcon({
          html: marker_rojo,
          className: 'custom-marker-icon',
          iconSize: [30, 35],
          iconAnchor: [17, 17],
          popupAnchor: [0, -13]
      })
    };

    this.icono_azul={
      icon: L.divIcon({
          html: marker_azul,
          className: 'custom-marker-icon',
          iconSize: [30, 35],
          iconAnchor: [17, 17],
          popupAnchor: [0, -13]
      })
    };

    this.icono_amarillo={
      icon: L.divIcon({
          html: marker_amarillo,
          className: 'custom-marker-icon',
          iconSize: [30, 35],
          iconAnchor: [17, 17],
          popupAnchor: [0, -13]
      })
    };

    this.icono_plomo = {
      icon: L.divIcon({
          html: marker_plomo, // Asegúrate de que este sea un string HTML válido
          className: 'custom-marker-icon',
          iconSize: [30, 35],
          iconAnchor: [17, 17],
          popupAnchor: [0, -13]
      })
  };

    this.icono_parqueo = {
      icon: L.icon({
        iconUrl: './assets/iconos/marcadores/icon-parqueo.svg',
        iconSize: [20, 41],     // Ajusta el tamaño del ícono
        iconAnchor: [10, 34],   // DERECHA IZQ  -   ARRIBA+ ABAJ0-
        popupAnchor: [3, -35]  // Ajusta el ancla del popup
      })
    };  

    // Definir un icono personalizado para la ubicación actual
    this.icono_mi_ubicacion = L.icon({
      iconUrl: 'data:image/svg+xml;base64,' + btoa(this.generateSvgIcon('#20B7F6', false)),
      iconSize: [52, 52],
      iconAnchor: [16, 32],
      popupAnchor: [10, -25],
    });
    
    this.icono_mi_ubicacion_flecha = L.icon({
      iconUrl: 'data:image/svg+xml;base64,' + btoa(this.generateSvgIcon('#20B7F6', true)),
      iconSize: [52, 52],
      iconAnchor: [16, 32],
      popupAnchor: [10, -27],
    });

  }
  public initializeMap(elementId: string): void {
    this.cargarCapasMapa();
    this.map = L.map(elementId, {
      center: [-16.6574403011881, -64.95190911770706],
      zoom: 5,
      fadeAnimation: false,
      zoomAnimation: false,
      markerZoomAnimation: false,
      attributionControl: false,
      renderer: L.canvas()
    });

    this.osm.addTo(this.map);

    // this.map.on('resize', () => {
    //   this.map?.invalidateSize();
    // });

    setTimeout(() => {
      this.map?.invalidateSize();
      // this.CrearCluster();
    }, 1000);


  }
  public observeMapContainerResize(mapContainer: ElementRef): void {
    const resizeObserver = new ResizeObserver(() => {
      // console.log('El contenedor del mapa ha cambiado de tamaño');
      this.map.invalidateSize();
    });

    // Observa cambios en el tamaño del contenedor del mapa
    resizeObserver.observe(mapContainer.nativeElement);
  }
  ajustarTamaño(){
    this.map?.invalidateSize();
  }
  public getMapInstance(): L.Map {
    return this.map;
  }
  onMarkerClick(device: any) {

    let dispositivo = this.lista_dispositivos.find((d: any) => d.id_dispositivo === device.deviceId);
    // console.log("llego");
  
    this.AbrirTooltip(dispositivo);
  }
  AbrirPopup(dispositivo: any){
    const newMarker = this.markers[dispositivo.id];
    newMarker.openPopup();
  }
  AbrirTooltip(dispositivo: any) {
    // Cerrar el tooltip permanente del marcador anterior si existe
    this.CerrarTooltipAnterior();
  
    // Obtener el nuevo marcador seleccionado
    const newMarker = this.markers[dispositivo.id_dispositivo];
  
    // Añadir el tooltip permanente al nuevo marcador seleccionado
    newMarker.unbindTooltip(); // Quitar cualquier tooltip anterior del nuevo marcador
    newMarker.bindTooltip(dispositivo.placa, {
      permanent: true,
      direction: 'top',
      className: 'custom-tooltip',
      opacity: 0.75,
      offset: [0, -20]
    }).openTooltip();
  

    // Actualizar la referencia del marcador seleccionado
    this.selectedMarker = newMarker;

  
    // Asegurar que el mapa no cierre los tooltips al hacer clic en él
    this.map.off('click'); // Desactivar cualquier listener de clic anterior
    this.map.on('click', () => {
      if (this.selectedMarker) {
        this.selectedMarker.openTooltip(); // Asegurar que el tooltip permanezca abierto
      }
    });
  
    // Suscribirse al evento 'moveend' del mapa para manejar la apertura de tooltips después de mover el mapa
    this.map.off('moveend'); // Desactivar cualquier listener de 'moveend' anterior
    this.map.on('moveend', () => {
      if (this.selectedMarker && !this.selectedMarker.isTooltipOpen()) {
        this.selectedMarker.openTooltip(); // Reabrir el tooltip del marcador seleccionado si no está abierto
      }
    });
    this.zindez=this.zindez+100;
    newMarker.setZIndexOffset(this.zindez);
  }
  public seleccionaMarker(dispositivo: any): void {
    this.MarkerSeleccionado = this.markers[dispositivo.id_dispositivo];
    if (this.MarkerSeleccionado) {
      this.map.setView(this.MarkerSeleccionado.getLatLng(), 16);
      this.selectedMarker = this.MarkerSeleccionado;
      this.MarkerSeleccionado.openPopup();
      
    } else {
      console.log('Marcador no encontrado para el dispositivo:', dispositivo.id_dispositivo);
    }
  }
  CerrarTooltipAnterior() {
    if (this.selectedMarker) {
      // Quitar el tooltip permanente del marcador anterior
      this.selectedMarker.unbindTooltip();
  
      // Volver a asociar el tooltip como no permanente
      this.selectedMarker.bindTooltip(this.selectedMarker.getTooltip()?.getContent() || '', {
        permanent: false,
        direction: 'top',
        className: 'custom-tooltip',
        opacity: 0.75,
        offset: [0, -20]
      });
  
      // Actualizar la referencia del marcador seleccionado
      this.selectedMarker = null;
    }
  }
  public AgregarMarcador(event: any) {
    try {
      let data = event;

      if (data.positions) {
        // console.log("tipo de dato",data);
        
        for (let i = 0; i < data.positions.length; i++) {
          let position = data.positions[i];
          
          // Encontrar el dispositivo en la lista del usuario
          let dispositivo = this.lista_dispositivos_usuario.find((device: any) => device.id_dispositivo === position.deviceId);
         
          if (dispositivo) {
            // console.log("position ",data);
            if (!this.markers[position.deviceId]) {
              this.addMarker(position,dispositivo);
            } else {
              this.updateMarker(position,dispositivo);
            }
          } 
        }
        // Ajustar los límites del mapa solo en la primera carga
        if (!this.boundsAdjusted) {
          this.adjustMapBounds();
          this.boundsAdjusted = true; // Marcar como ajustado
        }
      }
      else{
      
        if (data && data.devices && Array.isArray(data.devices)) {
          for (let i = 0; i < data.devices.length; i++) {
              let device = data.devices[i];
  
              // Verifica la estructura del dispositivo
              // console.log("Dispositivo recibido:", device);
  
              // Verifica que el estado del dispositivo esté definido
              if (!device.status) {
                  // console.log("El dispositivo no tiene estado definido:", device);
                  continue; // Salta a la siguiente iteración
              }
  
              // Encuentra el dispositivo en la lista basada en la placa
              let devices = this.lista_dispositivos.find((d: any) => d.placa.trim() === device.name.trim());
  
              if (devices) {
                  let id = devices.id_dispositivo; // Ahora puedes acceder a la propiedad sin problemas
  
                  // Verifica que el marcador existe
                  if (this.markers[id]) {
                      if (device.status === 'offline' || device.status === 'unknown') {
                          this.markers[id].setIcon(this.icono_plomo.icon);
                          // console.log("Marcador actualizado para:", device);
                      }
                  } else {
                      // console.log("Marcador no encontrado para id:", id);
                  }
              } else {
                  // console.log("Dispositivo no encontrado en la lista de dispositivos:", device.name);
              }
          }
      }
        
        
        
      }

    } catch (error) {
      console.error('Error al procesar datos:', error);
    }
  }
    
  private adjustMapBounds(): void {
    // Recoger todas las posiciones de los marcadores
    const markerPositions = Object.values(this.markers).map((marker: L.Marker) => marker.getLatLng());
  
    // Verificar que haya posiciones válidas antes de ajustar los límites
    if (markerPositions.length > 0 && markerPositions.every(pos => pos.lat !== undefined && pos.lng !== undefined)) {
      const bounds = L.latLngBounds(markerPositions);
      this.map.fitBounds(bounds);
    } else {
      console.warn('No valid marker positions found to adjust map bounds.');
    }
  }
  generateSvgIcon(color: string, direccion: boolean=true): string {
    /*
    return `
      <svg width="32px" height="48px" viewBox="0 0 32 48" xmlns="http://www.w3.org/2000/svg">
        <!-- Pointer -->
        <path d="M16,0 L20,10 L12,10 Z" fill="${color}" />
        <circle cx="16" cy="16" r="10.5" fill="${color}" stroke="#ffffff" stroke-width="0" />
        <circle cx="16" cy="16" r="9.3" fill="${color}" stroke="#ffffff" stroke-width="1" />
        <!-- White center circle -->
        <circle cx="16" cy="16" r="4" fill="#ffffff" />
      </svg>
    `;
    */
    return `
    <svg width="32px" height="48px" viewBox="0 0 32 48" xmlns="http://www.w3.org/2000/svg">
      ${direccion ? `<path d="M16,0 L20,10 L12,10 Z" fill="${color}" />` : ''}
      <circle cx="16" cy="16" r="10.5" fill="${color}" stroke="#ffffff" stroke-width="0" />
      <circle cx="16" cy="16" r="9.3" fill="${color}" stroke="#ffffff" stroke-width="1" />
      <!-- White center circle -->
      <circle cx="16" cy="16" r="4" fill="#ffffff" />
    </svg>
  `;

  }
  public addMarker(position: any,dispositivo: any): void {

    let icon = position.attributes.ignition ? this.icono_azul : this.icono_amarillo;
    

    this.markers[position.deviceId] = new DriftMarker([position.latitude, position.longitude], icon);
    this.markers[position.deviceId].setRotationAngle(position.course)
    this.markers[position.deviceId].bindTooltip(dispositivo.placa, {
             permanent: true,
             direction: 'top',
             className: 'custom-tooltip',
             opacity: 0.75,
             offset: [0, -7]
         });

  

        this.markers[position.deviceId].bindPopup(
          "<div class='custom-popup'>" +
            "<b>Placa :</b> " + dispositivo.placa + "<br/>" +
            "<b>Velocidad :</b> " + (position.speed * 1.852).toFixed(1) + " Km/h<br/>" +
            (position.deviceTime ? "<b>Fecha :</b> " + formatDate(position.deviceTime, 'dd/MM/yyyy ', 'en-US') + ' ' + new Date(position.deviceTime).toLocaleTimeString() + "<br/>" : '') +
            (position.attributes.batteryLevel ? "<b>Bat gps :</b> " + parseFloat(position.attributes.batteryLevel).toFixed(1) + "%<br/>" : '') +
            (position.attributes.battery ? "<b>Batería gps :</b> " + parseFloat(position.attributes.battery).toFixed(1) + " Volt.<br/>" : '') +
            (position.attributes.power ? "<b>Batería vehículo :</b> " + parseFloat(position.attributes.power).toFixed(1) + " Volt.<br/>" : '') +
            (position.attributes.out1 ? "<b>Motor :</b> " + 'Bloqueado' : '') +
            (position.address ? "<b>Ubicación:</b><br/> " + position.address : '') +
          "</div>"
        );
        // console.log("atriburos ",position.attributes);
        

      this.markers[position.deviceId].addTo(this.map);

      this.markers_map.push(this.markers[position.deviceId]); //para guardar los marker y usarlos para borrarlos

      this.estadoVehiculo(position);
    
  }
  public updateMarker(position: any,dispositivo: any): void {

    this.markers[position.deviceId].slideCancel();//detiene animacion
  
    let icon_aux = this.markers[position.deviceId].options.icon;
    icon_aux.options.iconUrl = position.attributes.ignition ? this.icono_azul : this.icono_amarillo ;
    this.markers[position.deviceId].setIcon(icon_aux); //cambia el icono si esta enedido o apagado

    this.markers[position.deviceId].bindPopup("<div class='custom-popup' > " +
      "<b>Placa :</b>  " + dispositivo.placa + '<br/>' +
      "<b>Velocidad :</b>  " + (position.speed * 1.852).toFixed(1) + ' Km/h<br/>' +
      (position.deviceTime != null ? '<b>Fecha :</b> ' + formatDate(position.deviceTime, 'dd/MM/yyyy ', 'en-US') + ' ' + (new Date(position.deviceTime)).toLocaleTimeString() + '<br/>' : '') +
      (position.attributes.batteryLevel != null ? '<b>Bat gps :</b> ' + parseFloat(position.attributes.batteryLevel).toFixed(1) + '%<br/>' : '') +
      (position.attributes.battery != null ? '<b>Bat gps :</b> ' + parseFloat(position.attributes.battery).toFixed(1) + ' Volt.<br/>' : '') +
      (position.attributes.power != null ? '<b>Bat vehículo :</b> ' + parseFloat(position.attributes.power).toFixed(1) + ' Volt.<br/>' : '') +
      (position.address != null ? '<b>Ubicación</b><br/> ' + position.address : '') +
      "<div> ");
  

      this.markers[position.deviceId].setRotationAngle(position.course);

      this.markers[position.deviceId].slideTo([position.latitude, position.longitude], {
          duration: 5000, 
          keepAtCenter: false
        });

      this.map.dragging.enable();
      this.map.scrollWheelZoom.enable();
      this.map.doubleClickZoom.enable();

  }
  estadoVehiculo(position: any) {
    // Obtén la fecha y hora actual usando Luxon
    const now = DateTime.now();

    // Convierte deviceTime a un objeto DateTime de Luxon
    const lastUpdateTime = DateTime.fromISO(position.deviceTime);

    // Calcula la diferencia en minutos
    const diffMinutes = now.diff(lastUpdateTime, 'minutes').minutes;

    // Verifica si la diferencia es mayor a 5 minutos
    if (diffMinutes > 5) {
        // Cambia el icono del marcador
        this.markers[position.deviceId].setIcon(this.icono_plomo.icon);
        // console.log(`Marcador cambiado a offline para: ${position.deviceId}`);
    } else {
        // console.log(`Marcador sigue online para: ${position.deviceId}`);
    }
  }
  agregarBotonVehiculo() {
    const customButton = L.DomUtil.create('div', 'custom-leaflet-control color-icono-vehiculo');
    customButton.style.cssText = `
      background-color: #28a745;
      border: none;
      border-radius: 50%;
      width: 35px;
      height: 35px;
      cursor: pointer;
      position: absolute;
      left: 10px;
      top: 92px;
    `;
    customButton.title = 'Lista de dispositivos';
  
    const icon = L.DomUtil.create('img', 'custom-icon', customButton);
    icon.src = 'assets/iconos/botones/icon-monitoreo.svg';
    icon.style.margin = 'auto';
  
    // Evento 'click' para abrir el overlay al presionar el botón
    L.DomEvent.on(customButton, 'click', (e) => {
      setTimeout(() => {
        // Usa el servicio para abrir el overlay
        this.overlay_aux_click=e;
        this.abrirOverlay(e);  
      }, 0); // Ejecutar de manera asincrónica
      L.DomEvent.stopPropagation(e);
    });
  
    this.map.getContainer().appendChild(customButton);
  }
  agregarBotonTipoMapa(){
    const customButton = L.DomUtil.create('div', 'custom-leaflet-control color-icono-tipo-mapa');
    customButton.style.backgroundColor = '#28a745'; // Color de fondo del botón
    customButton.style.border = 'none'; // Quitar cualquier borde
    customButton.style.borderRadius = '50%'; // Forma circular
    customButton.style.width = '35px'; // Ancho del botón
    customButton.style.height = '35px'; // Alto del botón
    customButton.style.cursor = 'pointer';
    customButton.style.position = 'absolute'; // Posición absoluta para colocar en la esquina
    customButton.style.left = '10px'; // Ajuste de posición para colocar a la izquierda
    customButton.style.top = '134px'; // Ajuste de posición para colocar debajo del botón de zoom
    customButton.title = 'Tipo de mapa';
  
    const icon = L.DomUtil.create('img', 'custom-icon', customButton);
    icon.src = 'assets/iconos/botones/icon-tipo-mapa.svg'; // Ruta de tu icono personalizado
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
  agregarBotonUbicacionActual(){
    const customButton = L.DomUtil.create('div', 'custom-leaflet-control color-icono-tipo-mapa');
    customButton.style.backgroundColor = '#28a745'; // Color de fondo del botón
    customButton.style.border = 'none'; // Quitar cualquier borde
    customButton.style.borderRadius = '50%'; // Forma circular
    customButton.style.width = '35px'; // Ancho del botón
    customButton.style.height = '35px'; // Alto del botón
    customButton.style.cursor = 'pointer';
    customButton.style.position = 'absolute'; // Posición absoluta para colocar en la esquina
    customButton.style.left = '10px'; // Ajuste de posición para colocar a la izquierda
    customButton.style.top = '176px'; // Ajuste de posición para colocar debajo del botón de zoom
    customButton.title = 'Mi ubicaion';
  
    const icon = L.DomUtil.create('img', 'custom-icon', customButton);
    icon.src = 'assets/iconos/botones/icon-mi-ubicacion.svg'; // Ruta de tu icono personalizado
    // icon.style.width = '20px'; // Ancho del icono
    // icon.style.height = '20px'; // Alto del icono
    icon.style.margin = 'auto'; // Centrar el icono dentro del contenedor
  
    L.DomEvent.on(customButton, 'click', (e) => {

          // this.borrarRutaComoLlegarRestaurarTodo();
          //this.borrarRutaComoLlegar();
          this.DetenerUbicacionActualComoLlegar();
          this.ObtenerUbicacionActual();
          this.emitirReporteComoLlegar("Mi ubicación");
          
    });
  
    this.map.getContainer().appendChild(customButton); 
  
    
  }
  agregarBotonUbicacionActual2(placa:string){
    this.DetenerUbicacionActualComoLlegar();
    this.ObtenerUbicacionActual();
    this.emitirReporteComoLlegar("Llegar "+placa);
  } 
  DetenerUbicacionActualComoLlegar(): void {

    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId); // Detener el seguimiento
      this.watchId = null; // Resetear el ID
    }
    // Eliminar el marcador de ubicación actual, si es necesario
    if (this.markers[this.index_ubicacion_actual]) {
      this.map.removeLayer(this.markers[this.index_ubicacion_actual]); // Eliminar el marcador del mapa
      this.markers[this.index_ubicacion_actual] = null; // Limpiar la referencia del marcador
    }

    this.bandera_trazar_como_llegar=false;

  } 
  ObtenerUbicacionActual(): void {


    if (navigator.geolocation) {
        this.watchId = navigator.geolocation.watchPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                const heading = position.coords.heading; // Dirección en grados

                // Obtener fecha y hora actual con Luxon
                const now = DateTime.now().setZone('local'); // Fecha y hora actual en la zona horaria local
                const fechaHoraActual = now.toFormat('dd/LL/yyyy HH:mm:ss'); // Formato DD/MM/YYYY HH:mm:ss

                // Determinar qué icono usar (con o sin flecha)
                const iconoUbicacionActual = heading !== null
                ? this.icono_mi_ubicacion_flecha
                : this.icono_mi_ubicacion;

                // Actualizar el marcador de la ubicación del usuario
                if (this.markers[this.index_ubicacion_actual]) {
                    // Si el marcador ya existe, actualiza su posición y contenido del popup
                    this.markers[this.index_ubicacion_actual].setLatLng([lat, lon]);
                    this.markers[this.index_ubicacion_actual].setIcon(iconoUbicacionActual);
                    this.markers[this.index_ubicacion_actual].setRotationAngle(heading);
                    this.markers[this.index_ubicacion_actual]
                        .setPopupContent(`Mi ubicación<br>Fecha: ${fechaHoraActual}`)
                        .openPopup();
                    this.markers[this.index_ubicacion_actual].setZIndexOffset(1000);
                } else {
                    // Crear el marcador con un popup que incluye la fecha y hora
                    this.markers[this.index_ubicacion_actual] = L.marker([lat, lon], {}).addTo(this.map)
                        .bindPopup(`Mi ubicación<br>Fecha: ${fechaHoraActual}`).openPopup();
                }

                // Centrar el mapa la primera vez
                this.contador_mi_ubicacion_actual++;
                if(this.contador_mi_ubicacion_actual){
                  this.map.setView([lat, lon], 15);
                }

                
                // Calcular la distancia recorrida
                if (this.ultimaUbicacion) {

                    const nuevaUbicacion = L.latLng(lat, lon);
                    const distancia = this.ultimaUbicacion.distanceTo(nuevaUbicacion);

                    // Acumular la distancia recorrida
                    this.distanciaRecorrida += distancia;

                    // Si la distancia supera los 100 metros, volver a trazar la ruta
                    /*if (this.distanciaRecorrida >= 100) {

                        if (this.MarkerSeleccionado && this.bandera_trazar_como_llegar) { //es posible que sea null por eso el if
                          const latLng = this.MarkerSeleccionado.getLatLng();
                          const lat = latLng.lat; // Obtener la latitud
                          const lon = latLng.lng; // Obtener la longitud
                          this.trazarRutaComoLlegar(lat, lon); // Asumiendo que tienes acceso a las coordenadas de destino
                          this.distanciaRecorrida = 0; // Reiniciar la distancia recorrida
                        }

                    }*/
                    if (this.distanciaRecorrida >= 100) { //centramos el mapa cada 100 metros
                      this.map.setView([lat, lon], 15);
                    }

                }

                // Actualizar la última ubicación
                this.ultimaUbicacion = L.latLng(lat, lon);
            },
            (error) => {
                console.error('Error al obtener la ubicación: ', error);
                
                this.emitirError("Ubicación no encontrado, Para mayor precicion utilizar un dispositivo con GPS");
            },
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            }
        );
    } else {
        console.error('Geolocalización no soportada en este navegador');
    }
  }
  centrarMiUbicacion(){
    
    if(this.markers[this.index_ubicacion_actual]){
      // this.markers[this.index_ubicacion_actual].openPopup();
      this.map.setView(this.markers[this.index_ubicacion_actual].getLatLng(), 16);
    }

  }
  activarBanderaTrazarComoLlegar(){
    this.bandera_trazar_como_llegar=true;
  }
  trazarRutaComoLlegar(destinoLat: number, destinoLon: number): void {
    if (!this.markers[this.index_ubicacion_actual]) {
      console.error('La ubicación actual no ha sido obtenida aún.');
      console.log("ubicacion actual ",this.markers[this.index_ubicacion_actual],this.index_ubicacion_actual);
      
      this.emitirError("La ubicación actual no ha sido obtenida a un");
      return;
    }
    if(!this.bandera_trazar_como_llegar){
      console.error('Bandera no activada para trazar ruta de como llegar.');
      return;
    }
  
    const origen = L.latLng(this.markers[this.index_ubicacion_actual].getLatLng());
    const destino = L.latLng(destinoLat, destinoLon);
  
    // Si ya existe una ruta, elimínala antes de crear una nueva
    if (this.routingControl !== null) {
      this.borrarRutaComoLlegar();
    }
  
    // Asigna el nuevo control de rutas a this.routingControl
    this.routingControl = L.Routing.control({
      waypoints: [
        origen,
        destino
      ],
      routeWhileDragging: false,
      router: L.Routing.osrmv1({
        serviceUrl: 'https://router.project-osrm.org/route/v1',
        language: 'es',
      }),
      fitSelectedRoutes: false,
      show: false, // Ocultar el botón de detalles de ruta por defecto
  
      lineOptions: {
        styles: [
          { color: '#20B7F6', opacity: 1, weight: 6 }  // Cambiar color a azul, opacidad 0.7, grosor 6
        ],
        extendToWaypoints: true,
        missingRouteTolerance: 0,
      },
      plan: L.Routing.plan([origen, destino], {
        createMarker: function() { 
          // Crear un marcador "invisible" o un marcador personalizado
          return L.marker([0, 0], { opacity: 0, interactive: false }); // Marcador invisible
        }
      })
    }).addTo(this.map);
  
    // Evento `routesfound`, que se dispara cuando la ruta es encontrada
    this.routingControl.on('routesfound', (e:any) => {
      // Eliminar los marcadores generados por la ruta punto inicio y punto final por que ya existe
      const markers = this.routingControl.getPlan()._markers;
      markers.forEach((marker:any) => {
        // Verifica si el marcador es diferente del de la ubicación actual antes de eliminarlo
        if (marker !== this.markers[this.index_ubicacion_actual]) {
          this.map.removeLayer(marker);
        }
      });
    });
  }
  borrarRutaComoLlegarRestaurarTodo(): void {//anula como llegar por completo

    this.bandera_trazar_como_llegar=false;
    this.DetenerUbicacionActualComoLlegar(); // Detener la obtención de la ubicación actual
    this.borrarRutaComoLlegar();
    this.contador_mi_ubicacion_actual=0;

  }
  borrarRutaComoLlegar(): void {//borra como llegar su ruta
    if (this.routingControl !== null) {
      this.map.removeControl(this.routingControl); // Eliminar el control de la ruta del mapa
      this.routingControl = null; // Resetear la variable para evitar referencias a un control eliminado
    }
  }
  
  // Función para abrir el modal de la ruta
  abrirModalRuta(): void {
    // this.cerrarModalRuta();
    const routingPanel = document.querySelector('.leaflet-routing-container-hide');
    if (routingPanel) {
      routingPanel.classList.remove('leaflet-routing-container-hide'); // Quitar la clase para mostrar el modal
    }
    else{
      this.cerrarModalRuta();
    }
  }

  // Función para cerrar el modal de la ruta
  cerrarModalRuta(): void {
    const routingPanel = document.querySelector('.leaflet-routing-container');
    if (routingPanel) {
      routingPanel.classList.add('leaflet-routing-container-hide'); // Añadir la clase para ocultar el modal
      routingPanel.classList.remove('show'); // Si también usas 'show', quítala
    }
  }

  removeDefaultLayersControl() {
    // Buscar y eliminar el control de capas por defecto
    const layersControl = document.getElementsByClassName('leaflet-control-layers')[0];
    if (layersControl) {
      layersControl.remove();
    }
  }
  changeBaseLayer(): void {
    this.map.removeLayer(this.baseLayers[this.currentLayerIndex]);
    this.currentLayerIndex = (this.currentLayerIndex + 1) % this.baseLayers.length;
    this.map.addLayer(this.baseLayers[this.currentLayerIndex]);
  }
  public removeMarkers(): void {
    this.map.eachLayer(layer => {
      if (layer instanceof L.Marker) {
        this.map.removeLayer(layer);
      }
    });
  }
  cargarCapasMapa(): void {
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
  GetRutasTraccar(viaje: any): Promise<any[]> {
    let f_ini = DateTime.fromISO(viaje.startTime).toISO();
    let f_fin = DateTime.fromISO(viaje.endTime).toISO();
  
    return new Promise((resolve, reject) => {
      this.traccar.get_rutas(viaje.deviceId, f_ini, f_fin).subscribe(
        async data => {
          let ruta_aux = JSON.parse(JSON.stringify(data));
          let ruta_unico = this.QuitarDuplicados(ruta_aux);
          this.lista_rutas_traccar = JSON.parse(JSON.stringify(ruta_unico));
          this.DibujarRutaTraccar(ruta_unico);
          resolve(ruta_unico);
        },
        error => {
          console.error('Errores:', error);
          reject(error);
        }
      );
    });
  }
  GetViajesTraccar(viaje: any): Promise<any[]> {
    let f_ini = DateTime.fromISO(viaje.startTime).toISO();
    let f_fin = DateTime.fromISO(viaje.endTime).toISO();
  
    return new Promise((resolve, reject) => {
      this.traccar.get_viajes(viaje.deviceId, f_ini, f_fin).subscribe(
        async data => {

          // console.log("res viajes ",data);
          
          // let ruta_aux = JSON.parse(JSON.stringify(data));
          //let ruta_unico = this.QuitarDuplicados(ruta_aux);
          // this.lista_rutas_traccar = JSON.parse(JSON.stringify(ruta_aux));
          // this.DibujarRutaTraccar(ruta_aux);

          let data_res=JSON.parse(JSON.stringify(data));
          resolve(data_res);
        },
        error => {
          console.error('Errores:', error);
          reject(error);
        }
      );
    });
  }
  GetParqueosTraccar(viaje: any): Promise<any[]> {

    let f_ini = DateTime.fromISO(viaje.startTime).toISO();
    let f_fin = DateTime.fromISO(viaje.endTime).toISO();
  
    return new Promise((resolve, reject) => {
      this.traccar.get_parqueo(viaje.deviceId, f_ini, f_fin).subscribe(
        async data => {

          await this.hideTooltips();
          let data_res=JSON.parse(JSON.stringify(data));
          for (let index = 0; index < data_res.length; index++) {
              
              this.AgregarMarcadorParqueo(data_res[index]);
          }

          if(viaje.centrar_parqueo!==true){ //se ajusta el mapa unicamente si el reporte es parqueos y si es rutas con parqueos no ajustar mapa
            this.map.fitBounds(this.lista_centrado_parqueo, {
              padding: [10, 10] // Margen de 10 píxeles en todos los lados
            });
          }

          resolve(data_res);
        },
        error => {
          console.error('Errores:', error);
          reject(error);
        }
      );
    });

  }
  AgregarMarcadorParqueo(data: any) {

    const duracion = Duration.fromMillis(data?.duration).shiftTo('hours', 'minutes');
    const horas = Math.floor(duracion.hours); // Redondear las horas
    const minutos = Math.floor(duracion.minutes); // Redondear los minutos restantes

    this.markers[data.positionId] = new DriftMarker([data.latitude, data.longitude], this.icono_parqueo);

    this.markers[data.positionId].bindPopup("<div class='custom-popup' > " +
      "<b>Placa :</b>  " + data.deviceName + '<br/>' +
      "<b>Tiempo parqueo :</b>  "+`${horas} h ${minutos} m`+ '<br/>' +
      "<b>Fecha inicio :</b>  "+DateTime.fromISO(data.startTime).toFormat('dd-MM-yyyy HH:mm:ss')+ '<br/>' +
      "<b>Fecha fin :</b>  "+DateTime.fromISO(data.endTime).toFormat('dd-MM-yyyy HH:mm:ss')+ '<br/>' +
      "<b>Dirección :</b>  "+data.address+ '<br/>' +
      "<div> ");

    this.zindez=this.zindez+100;
    this.markers[data.positionId].setZIndexOffset(this.zindez);

    this.markers[data.positionId].addTo(this.map);
    this.lista_centrado_parqueo.push(
    {
          lat:data.latitude,
          lng:data.longitude,
    });
    
    this.lista_parqueos.push(this.markers[data.positionId]);
  }
  public async hideTooltips(): Promise<void> {
    for (const marker of this.markers) {
        const tooltip = marker?.getTooltip();
        if (tooltip && marker.shouldShowTooltip!==true) {
            this.tooltips.set(marker, tooltip); // Guarda el tooltip
            marker.unbindTooltip(); // Quita el tooltip del marcador
        }
    }
  }


  public showTooltips(): Promise<void> {
    return new Promise<void>((resolve) => {
        this.tooltips.forEach((tooltip, marker) => {
            if (marker && marker.shouldShowTooltip!==true) {
                marker.bindTooltip(tooltip); // Restaura el tooltip al marcador
            }
        });
        resolve(); // Resuelve la promesa después de restaurar todos los tooltips
    });
  }



  async DibujarRutaTraccar(lista_rutas_traccar: any[]) {
    
    this.borrarMarcadores();
    await this.hideTooltips();
    this.map.closePopup();
    this.lista_marcadores = [];
    let linea_rutas = [];
    let lista_dispositivos = [];
  
    // Configuración de íconos
    const iconoInicio = L.icon({
      iconUrl: './assets/iconos/marcadores/circulo/bandera_inicio.svg',
      iconSize: [40, 40],
      iconAnchor: [4, 39], //derecha+ izquierda-   arriba+ abajo-
      popupAnchor:[0,-41] //derecha izquierda  -  arriba- abajo+
    });
 
    const iconoFinal = L.icon({
        iconUrl: './assets/iconos/marcadores/circulo/bandera_final.svg',
        iconSize: [40, 40],
        iconAnchor: [36, 39], //derecha+ izquierda-   arriba+ abajo-
        popupAnchor:[0,-41] //derecha izquierda  -  arriba- abajo+
    });

    const iconoFlechaAzul = L.icon({
      iconUrl: './assets/iconos/marcadores/flecha/icon-flecha-azul.svg',
      iconSize: [8, 10],
      iconAnchor: [4, 3],
      popupAnchor:[0,-3]
    });

    const iconoFlechaNaranja = L.icon({
      iconUrl: './assets/iconos/marcadores/flecha/icon-flecha-naranja.svg',
      iconSize: [8, 10],
      iconAnchor: [4, 3],
      popupAnchor:[0,-3]
    });
  
    // Crear marcadores y configurar íconos
    
    for (let indice of lista_rutas_traccar) {
      let icono;
      let zindex_aux =0;
      if (lista_rutas_traccar.indexOf(indice) === 0) {
        icono = iconoInicio;
        zindex_aux =  this.zindez+10000;
        this.zindez=this.zindez+100;
      } else if (lista_rutas_traccar.indexOf(indice) === lista_rutas_traccar.length - 1) {
        icono = iconoFinal;
        zindex_aux =  this.zindez+10001;
        this.zindez=this.zindez+100;
      } else if (parseFloat((Number(indice.speed) * 1.852).toFixed(2)) > 90) {
        icono = iconoFlechaNaranja;
        this.zindez=this.zindez+100;
        zindex_aux = this.zindez;
      } else {
        icono = iconoFlechaAzul;
        this.zindez=this.zindez+100;
        zindex_aux = this.zindez;
      }
  
      lista_dispositivos.push({
        lat: indice.latitude,
        lng: indice.longitude,
      });
  // console.log(indice);
  
      this.markers[indice.id] = L.marker([indice.latitude, indice.longitude], { icon: icono });
      this.markers[indice.id].bindPopup(
        "<div class='custom-popup'> " +
        " <b>Fecha :</b>  " + DateTime.fromISO(indice.deviceTime).toFormat('dd-MM-yyyy HH:mm:ss') +
        " <br> <b>Velocidad :</b>  " + parseFloat((Number(indice.speed) * 1.852).toFixed(2) + '') + " Km/h" +
        " <br> <b>Batería vehículo :</b>  " + parseFloat(indice.attributes.power).toFixed(2) + " Volt." +
        " <br> <b>Batería Gps:</b>  " + parseFloat(indice.attributes.battery).toFixed(2) + " Volt." +
        " <br> <b>Motor:</b>  " + ((indice.attributes.ignition == true) ? ' Encendido' : ' Apagado') +
        // " <br> <b>Movimiento:</b>  " + ((indice.attributes.motion == true) ? ' Si' : ' No') +
        " <br> <b>Odometro:</b>  " + parseFloat((Number(indice.attributes.odometer) / 1000) + '').toFixed(2) + " Km" +
        "<div>"
      );

      /*if (lista_rutas_traccar.indexOf(indice) === 0 || lista_rutas_traccar.indexOf(indice) === lista_rutas_traccar.length - 1) {
        
      }else{
        this.markers[indice.id].shouldShowTooltip = false; 
      }*/


      this.markers[indice.id].setZIndexOffset(zindex_aux);

      this.markers[indice.id].addTo(this.map);
  
      if (lista_rutas_traccar.indexOf(indice) === 0) {
        this.markers[indice.id].bindTooltip('Inicio', {
          permanent: false,
          className: 'custom-tooltip',
          direction: 'top',
          offset: [0, -24]
        });
        this.markers[indice.id].shouldShowTooltip = true; 
      } else if (lista_rutas_traccar.indexOf(indice) === lista_rutas_traccar.length - 1) {
        this.markers[indice.id].bindTooltip('Final', {
          permanent: false,
          className: 'custom-tooltip',
          direction: 'top',
          offset: [0, -24]
        });
        this.markers[indice.id].shouldShowTooltip = true; 
      }else{
        this.markers[indice.id].setRotationAngle(indice.course);
      }
  
      this.lista_marcadores.push(this.markers[indice.id]);
      linea_rutas.push(this.markers[indice.id].getLatLng());
    }


    // Dibujar la ruta
    if (this.polylines) {
      this.polylines.removeFrom(this.map);
    }
  
    if (linea_rutas.length > 0) {
      this.polylines = L.polyline(linea_rutas, {
        color: '#58ACFA',
        weight: 6,
      }).addTo(this.map);
    }
  
    // Limpiar clusters existentes y agregar marcadores al cluster
    // if (this.markerClusterGroup) {
    //   this.markerClusterGroup.clearLayers();
    // } else {
    //   this.markerClusterGroup = L.markerClusterGroup();
    //   this.map.addLayer(this.markerClusterGroup);
    // }
  
    // this.markerClusterGroup.addLayers(this.lista_marcadores);
  
    // Ajustar límites y centrar mapa
    if (linea_rutas.length > 0 && lista_dispositivos.length > 0) {
      let bounds = L.latLngBounds([...linea_rutas, ...lista_dispositivos]);
      this.map.fitBounds(bounds,{ padding: [20, 20] });
    }
  
    // Manejo de eventos de popups
    // document.querySelector('.leaflet-pane.leaflet-popup-pane')!.addEventListener('click', event => {
    //   event.preventDefault();
    // });
  }
  borrarMarcadores() {
    if(this.lista_marcadores){
      for (let indice of this.lista_marcadores){
        this.map.removeLayer(indice);
      }
    }
    if (this.polylines) {
      this.polylines.removeFrom(this.map);
    }
    if(this.lista_parqueos){
      for (let indice of this.lista_parqueos){
        this.map.removeLayer(indice);
      }
    }
    
    this.borrarRutaComoLlegarRestaurarTodo();
    
  }
  removeAllMarkers(): void { //se invoca desde el componente para ngOnDestroy
    this.markers_map.forEach(marker => {
      this.map.removeLayer(marker);  // Elimina cada marcador del mapa
    });
    this.markers_map = [];  // Limpia el array de marcadores
    this.markers=[];
    this.borrarRutaComoLlegarRestaurarTodo();
  }
  QuitarDuplicados(data: RoutePoint[]): RoutePoint[] {
    const uniqueRoutes: RoutePoint[] = [];
    const uniqueSet = new Set<string>();

    // Eliminar duplicados
    data.forEach(route => {
      //const routeString = `${route.latitude},${route.longitude},${route.timestamp}`;
      const routeString = `${route.latitude},${route.longitude}`;
      if (!uniqueSet.has(routeString)) {
        uniqueSet.add(routeString);
        uniqueRoutes.push(route);
      }
    });

    return uniqueRoutes;
  }

}
