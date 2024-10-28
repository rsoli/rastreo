import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-draw';
import 'leaflet-control-geocoder';
import { HttpClient } from '@angular/common/http';

import { geocoder as createGeocoder, geocoder } from 'leaflet-control-geocoder';


//para que renonozca los iconos de leaflet
import { Icon } from 'leaflet';
const DefaultIcon = Icon.Default.prototype;
DefaultIcon.options.iconUrl = 'assets/leaflet/images/marker-icon.png';
DefaultIcon.options.iconRetinaUrl = 'assets/leaflet/images/marker-icon-2x.png';
DefaultIcon.options.shadowUrl = 'assets/leaflet/images/marker-shadow.png';


interface GeocoderControlOptions {
  serviceUrl?: string; // URL personalizada para el servicio de geocodificación
  placeholder?: string; // Texto de marcador de posición
}

// Extender la interfaz GeocoderControlOptions para incluir serviceUrl
declare module 'leaflet-control-geocoder' {
  export interface geocoder {
    serviceUrl?: string; // Añadir serviceUrl como opción
    placeholder?: string;
  }
}

declare module 'leaflet' {
  namespace Control {
    function geocoder(options?: any): L.Control;
  }
}


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements  AfterViewInit, OnDestroy {
  @Input() id_map: string = '';
  @Input() geocerca: any; // Recibe la geocerca como un input
  @Output() geocercaChange = new EventEmitter<any>(); // Emite cambios de la geocerca

  @Output() geocercaDeleted = new EventEmitter<void>(); // Nuevo: Emitir cuando se elimina u

  private map!: L.Map;
  private drawnItems!: L.FeatureGroup;

  constructor(private http: HttpClient) {}

  ngAfterViewInit() {

    //console.log('Map ID:', this.id_map);
    this.initMap(this.id_map);

    // Llama a la función para dibujar la geocerca pasada como parámetro
    if (this.geocerca) {
     
      this.drawGeocerca(this.geocerca);

      ////////////para enviar parametro al inicio
      let area_aux;
      if (this.geocerca.startsWith('POLYGON')) {
        area_aux = {tipo_geocerca:'Polígono',area:this.geocerca};
        this.geocercaChange.emit(area_aux);
      }else if(this.geocerca.startsWith('CIRCLE')){
        area_aux = {tipo_geocerca:'Circulo',area:this.geocerca};
        this.geocercaChange.emit(area_aux);
      }
      
      
    }

  }
  private drawGeocerca(geocerca: string): void {
    if (geocerca.startsWith('CIRCLE')) {
      // Dibujar círculo
      const circleRegex = /CIRCLE\(([-\d.]+) ([-\d.]+), ([\d.]+)\)/;
      const match = circleRegex.exec(geocerca);
      if (match) {
        const lat = parseFloat(match[1]);
        const lng = parseFloat(match[2]);
        const radius = parseFloat(match[3]);

        const circle = L.circle([lat, lng], { radius });
        this.drawnItems.addLayer(circle);

        // Ajustar el zoom automáticamente para mostrar el círculo completo
        this.map.fitBounds(circle.getBounds());
      }
    } else if (geocerca.startsWith('POLYGON')) {
      // Dibujar polígono
      const polygonRegex = /POLYGON\(\((.+)\)\)/;
      const match = polygonRegex.exec(geocerca);
      if (match) {
        const coordinates = match[1]
          .split(',')
          .map((coord: string) => {
            const [lat, lng] = coord.trim().split(' ').map(Number);
            return [lat, lng] as [number, number];
          });

        const polygon = L.polygon(coordinates);
        this.drawnItems.addLayer(polygon);

        // Ajustar el zoom automáticamente para mostrar el polígono completo
        this.map.fitBounds(polygon.getBounds());
      }
    }
  }
  ngOnDestroy() {
    if (this.map) {
      this.map.remove();
    }
  }
/*
  private initMap(id_map: string): void {
     this.map = L.map(id_map,{attributionControl: false }).setView([ -16.2902, -63.5887], 5);

     L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
       attribution: '© OpenStreetMap contributors'
     }).addTo(this.map);

     this.drawnItems = new L.FeatureGroup();
     this.map.addLayer(this.drawnItems);

     const drawControl = new L.Control.Draw({
       draw: {
         marker: false, // Desactivar el control de dibujado del marker
         rectangle: false, // Desactivar el control de dibujado del rectángulo
         circlemarker: false, // Desactivar el control de dibujado del círculo
         polyline: false, 
       },
       edit: {
         featureGroup: this.drawnItems,
         edit: false,
         remove: true
       }
     });

     // Modificar los textos de L.drawLocal en lugar de reasignarlo
     L.drawLocal.draw.toolbar.actions = {
       title: 'Cancelar dibujo',
       text: 'Cancelar'
     };
     L.drawLocal.draw.toolbar.finish = {
       title: 'Finalizar dibujo',
       text: 'Guardar'
     };
     L.drawLocal.draw.toolbar.undo = {
       title: 'Eliminar el último punto',
       text: 'Deshacer'
     };

     L.drawLocal.draw.toolbar.buttons = {
       polyline: 'Dibujar una polilínea',  // Si no lo usas, igual debes definirlo
       polygon: 'Dibujar un polígono',
       rectangle: 'Dibujar un rectángulo',  // No lo usas pero lo defines
       circle: 'Dibujar un círculo',
       marker: 'Colocar un marcador',  // No lo usas pero lo defines
       circlemarker: 'Dibujar un círculo marcador'  // No lo usas pero lo defines
     };

     L.drawLocal.edit.toolbar.actions = {
       save: {
         title: 'Guardar cambios',
         text: 'Guardar'
       },
       cancel: {
         title: 'Cancelar edición',
         text: 'Cancelar'
       },
       clearAll: {
         title: 'Eliminar todas las capas',
         text: 'Eliminar todo'
       }
     };

     L.drawLocal.edit.toolbar.buttons = {
       edit: 'Editar capas',
       editDisabled: 'No hay capas para editar',
       remove: 'Eliminar capas',
       removeDisabled: 'No hay capas para eliminar'
     };
  
     this.map.addControl(drawControl);


     this.map.on(L.Draw.Event.CREATED, (event: any) => {
       const layer = event.layer;
       this.drawnItems.addLayer(layer);
       let geocerca_local=this.PreparaEnvio(event);
       this.geocercaChange.emit(geocerca_local);
     });

    // Escuchar el evento de eliminación
    this.map.on(L.Draw.Event.DELETED, (event: any) => {
      
       this.geocercaDeleted.emit(); // Emitir evento cuando se elimina la geocerca
     });

  }
*/
  private control: any; // Puedes usar 'any' o crear un tipo específico si lo prefieres.

  private initMap(id_map: string): void {
    this.map = L.map(id_map, { attributionControl: false }).setView([-16.2902, -63.5887], 5);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    this.drawnItems = new L.FeatureGroup();
    this.map.addLayer(this.drawnItems);

    const drawControl = new L.Control.Draw({
        draw: {
            marker: false,
            rectangle: false,
            circlemarker: false,
            polyline: false,
        },
        edit: {
            featureGroup: this.drawnItems,
            edit: false,
            remove: true
        }
    });

    // Asegúrate de eliminar el control anterior si existe
    if (this.control) {
        this.map.removeControl(this.control);
    }

    // Configura el geocodificador
    const options: GeocoderControlOptions = {
        serviceUrl: 'https://ubibol.com/nominatim', // URL personalizada
        placeholder: 'Buscar ubicación...',
    };
    
    //console.log('Opciones del geocodificador:', options); // Debugging
    this.control = geocoder(options).addTo(this.map); 

    // Manejar el evento de geocodificación
    this.control.on('markgeocode', (event: { geocode: { name: string; center: L.LatLngExpression; } }) => {
      console.log('Buscar ubicación:', event.geocode.name);
      this.customGeocode(event.geocode.name); // Llama a tu función personalizada
    });
  

    this.map.addControl(drawControl);

    this.map.on(L.Draw.Event.CREATED, (event: any) => {
        const layer = event.layer;
        this.drawnItems.addLayer(layer);
        let geocerca_local = this.PreparaEnvio(event);
        this.geocercaChange.emit(geocerca_local);
    });

    this.map.on(L.Draw.Event.DELETED, (event: any) => {
        this.geocercaDeleted.emit();
    });
}
public customGeocode(query: string): Promise<{ name: string; center: L.LatLng }[]> {
  const serviceUrl = 'https://ubibol.com/nominatim/search';
  const url = `${serviceUrl}?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=5`;

  return this.http.get<any[]>(url).toPromise()
    .then((results) => {
      if (results) { // Verifica que results no sea undefined
        return results.map(result => ({
          name: result.display_name,
          center: L.latLng(result.lat, result.lon),
        }));
      }
      console.warn('No se encontraron resultados.');
      return []; // Devuelve un array vacío si no hay resultados
    })
    .catch(err => {
      console.error('Error en la búsqueda:', err);
      return []; // Devolver un array vacío en caso de error
    });
}
public onEnter(event: KeyboardEvent, query: string): void {
  event.preventDefault(); // Prevenir que se envíe el formulario
  this.customGeocode(query);
}






  PreparaEnvio(event:any){

      //CIRCLE(-17.00143141446992 -65.1591181753429, 70.33211045114504)
      //POLYGON((-17.375084563513543 -66.16356715070651, -17.376118071900454 -66.1598779396809, -17.371838437285128 -66.15897088155181, -17.37138717739301 -66.16284302908753))
   
      //console.log("ver framework ",event.layer._latlng.lat,event.layer._latlng.lng, event.layer.options.radius     );

      let geocerca = '';
      let area_aux={};
      
      if(event.layerType === "circle"){
        geocerca='CIRCLE('+event.layer._latlng.lat+' '+event.layer._latlng.lng+', '+event.layer.options.radius+")";
        area_aux = {tipo_geocerca:'Circulo',area:geocerca};
        // console.log("envio circulo ",area_aux);
        
      }
      else if(event.layerType == 'polygon'){
        let poli=event.layer._latlngs[0];
        geocerca+='POLYGON((';
        for (let index = 0; index < poli.length; index++) {

          geocerca +=''+poli[index].lat+' '+poli[index].lng;
          
          if(index < poli.length-1){
            geocerca+=',';
          }
          
        }
        geocerca+='))';
        area_aux = {tipo_geocerca:'Polígono',area:geocerca};
        // console.log("envio polygon ",area_aux);
      } else{
        area_aux={};
      }

      return area_aux;
  }

}
