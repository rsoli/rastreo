import { Component, AfterViewInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ApiService } from '../../servicios/api.service';
import { TaxiModelo } from '../../modelos/taxi-modelo';
import { Router } from '@angular/router';
import * as L from 'leaflet';
import 'leaflet-routing-machine'; // Importa la librería para el enrutamiento
import { DateTime } from 'luxon'; // Asegúrate de tener luxon instalado

//para que renonozca los iconos de leaflet
import { Icon } from 'leaflet';
const DefaultIcon = Icon.Default.prototype;
DefaultIcon.options.iconUrl = 'assets/leaflet/images/marker-icon.png';
DefaultIcon.options.iconRetinaUrl = 'assets/leaflet/images/marker-icon-2x.png';
DefaultIcon.options.shadowUrl = 'assets/leaflet/images/marker-shadow.png';


@Component({
  selector: 'app-taxi',
  templateUrl: './taxi.component.html',
  styleUrls: ['./taxi.component.css'],
  providers: [MessageService]
})
export class TaxiComponent implements AfterViewInit {

  loading = false;
  lista_taxi: Array<TaxiModelo> = [];
  columnas_taxi = TaxiModelo.columns;
  toolbarButtons = new Array();
  
  // Geolocalización
  watchId!: number; // ID del watcher de geolocalización
  index_ubicacion_actual = 0; // Índice para la ubicación actual
  markers: L.Marker[] = []; // Array de marcadores
  ultimaUbicacion!: L.LatLng; // Última ubicación del usuario
  distanciaRecorrida = 0; // Distancia acumulada

  contador_mi_ubicacion_actual=0;

  // Pedir taxi
  map!: L.Map;
  desdeMarker!: L.Marker;
  hastaMarker!: L.Marker;
  desde: string = '';
  hasta: string = '';
  routingControl: any; // Controlador para la ruta
  distancia: string = ''; 
  icono_mi_ubicacion: L.Icon = L.icon({
    iconUrl: 'assets/icons/mi-ubicacion.png', // Ruta a tu icono por defecto
    iconSize: [25, 41], // Tamaño del icono
    iconAnchor: [12, 41], // Punto de anclaje
    popupAnchor: [1, -34], // Punto de anclaje del popup
    shadowSize: [41, 41] // Tamaño de la sombra
  });

  constructor(private apiService: ApiService<TaxiModelo>, private messageService: MessageService, private router: Router) { }

  ngAfterViewInit(): void {
    // Inicializar el mapa
    this.map = L.map('map', {
      zoomControl: false,
      attributionControl: false,
    }).setView([-16.290154, -63.588653], 5);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
    }).addTo(this.map);

    L.control.zoom({
      position: 'bottomright'
    }).addTo(this.map);

    // Obtener la ubicación actual y centrar el mapa
    this.ObtenerUbicacionActual();

    // Actualizar las coordenadas cuando el usuario mueve el mapa
    this.map.on('move', () => {
      const centroMapa = this.map.getCenter();
      this.obtenerCoordenadas(centroMapa.lat, centroMapa.lng);
    });
  }

  obtenerCoordenadas(lat: number, lon: number): void {
    // Actualizar la ubicación actual cada vez que se mueva el mapa
    this.desde = `${lat.toFixed(5)}, ${lon.toFixed(5)}`;

    if (this.markers[this.index_ubicacion_actual]) {
      this.markers[this.index_ubicacion_actual].setLatLng([lat, lon]);
    } else {
      console.warn('El marcador aún no ha sido inicializado.');
    }

    console.log(`Ubicación seleccionada: ${this.desde}`);
  }

  ObtenerUbicacionActual(): void {
    if (navigator.geolocation) {
      this.watchId = navigator.geolocation.watchPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;

          // Obtener fecha y hora actual con Luxon
          const now = DateTime.now().setZone('local');
          const fechaHoraActual = now.toFormat('dd/LL/yyyy HH:mm:ss');

          // Crear el marcador con un popup que incluye la fecha y hora si no existe
          if (!this.markers[this.index_ubicacion_actual]) {
            this.markers[this.index_ubicacion_actual] = L.marker([lat, lon])
              .addTo(this.map)
              .bindPopup(`Mi ubicación<br>Fecha: ${fechaHoraActual}`)
              .openPopup();

            // Centrar el mapa solo la primera vez
            this.contador_mi_ubicacion_actual++;
            if (this.contador_mi_ubicacion_actual == 1) {
              this.map.setView([lat, lon], 15);
            }
          }

          // Actualizar la última ubicación
          this.desde = `${lat.toFixed(5)}, ${lon.toFixed(5)}`;
        },
        (error) => {
          console.error('Error al obtener la ubicación: ', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Ubicación no encontrada, por favor, verifica tu dispositivo.'
          });
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

  // Método para definir el marcador 'Desde' o 'Hasta'
  setMarker(type: 'desde' | 'hasta') {
    const position = this.map.getCenter();
    if (type === 'desde') {
    /*  if (this.desdeMarker) {
        this.map.removeLayer(this.desdeMarker);
      }
      this.map.setView(position, 13); 

      //this.ObtenerUbicacionActual
      this.desdeMarker = this.createDraggableMarker(position, 'Inicio').addTo(this.map);
      this.desdeMarker.on('dragend', () => {

        const { lat, lng } = this.desdeMarker.getLatLng();
        this.desde = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
        
        this.requestTaxi(); // Trazar ruta al cambiar el punto de inicio

      });*/
    } else {
      if (this.hastaMarker) {
        this.map.removeLayer(this.hastaMarker);
      }
      this.hastaMarker = this.createDraggableMarker(position, 'Final').addTo(this.map);
      this.hastaMarker.on('dragend', () => {
        const { lat, lng } = this.hastaMarker.getLatLng();
        this.hasta = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
        this.requestTaxi(); // Trazar ruta al cambiar el punto de inicio
      });
    }
  }

  private createDraggableMarker(position: L.LatLngExpression, tooltipText: string): L.Marker {
    const marker = L.marker(position, { draggable: true });
    marker.bindTooltip(tooltipText, {
      permanent: true,
      direction: 'top',
      className: 'custom-tooltip'
    });
    return marker;
  }

  private centerMap(desdeLat: number, desdeLon: number, hastaLat: number, hastaLon: number): void {
    const bounds = L.latLngBounds([
      [desdeLat, desdeLon],
      [hastaLat, hastaLon]
    ]);

    this.map.fitBounds(bounds); // Centra el mapa en los dos marcadores
  }

  requestTaxi() {

    this.map.off('move');

    if (this.desde && this.hasta) {
      const [desdeLat, desdeLon] = this.desde.split(',').map(Number);
      const [hastaLat, hastaLon] = this.hasta.split(',').map(Number);
      
      // Trazar la ruta desde el punto inicial hasta el final
      this.trazarRuta(desdeLat, desdeLon, hastaLat, hastaLon);

      this.centerMap(desdeLat, desdeLon, hastaLat, hastaLon);

      console.log(`Solicitando taxi desde ${this.desde} hasta ${this.hasta}`);
      this.messageService.add({ severity: 'success', summary: 'Solicitud de Taxi', detail: 'Taxi solicitado exitosamente.' });
    } else {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Por favor, completa ambas ubicaciones.' });
    }
  }

  private trazarRuta(origenLat: number, origenLon: number, destinoLat: number, destinoLon: number): void {
    if (!this.desde || !this.hasta) {
      console.error('Ambos puntos deben estar definidos para trazar la ruta.');
      return;
    }

    const origen = L.latLng(origenLat, origenLon);
    const destino = L.latLng(destinoLat, destinoLon);

    // Si ya existe una ruta, elimínala antes de crear una nueva
    if (this.routingControl) {
      this.map.removeControl(this.routingControl);
    }

    // Crea el controlador de rutas
    this.routingControl = L.Routing.control({
      waypoints: [origen, destino],
      routeWhileDragging: false,
      router: L.Routing.osrmv1({
        serviceUrl: 'https://router.project-osrm.org/route/v1',
        language: 'es',
      }),
      lineOptions: {
        styles: [
          { color: '#20B7F6', opacity: 1, weight: 6 }
        ],
        extendToWaypoints: true,  // Agregar esta propiedad
        missingRouteTolerance: 0   // Agregar esta propiedad
      },
      show: false
    }).addTo(this.map);

    // Escuchar el evento routesfound
    this.routingControl.on('routesfound', (e: any) => {
      const rutas = e.routes;
      if (rutas.length > 0) {
        this.distancia = (rutas[0].summary.totalDistance/1000).toFixed(2); // Total en metros
        this.distanciaRecorrida += parseFloat(this.distancia); // Acumular distancia
        this.messageService.add({ severity: 'info', summary: 'Distancia Recorrida', detail: `Total: ${this.distancia} Kilometros` });
      }
    });
  }
}
