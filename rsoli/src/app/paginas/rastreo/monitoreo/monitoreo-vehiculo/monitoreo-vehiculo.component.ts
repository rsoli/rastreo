import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-monitoreo-vehiculo',
  templateUrl: './monitoreo-vehiculo.component.html',
  styleUrls: ['./monitoreo-vehiculo.component.css']
})
export class MonitoreoVehiculoComponent implements OnInit {
  private map: any;
  tiles: any;
  vehiculo!: any[];
  vehiculo_seleccionado = [];

  seleccione_tipo_monitoreo!: any;
  tipo_monitoreo!: any[];

  fecha_ratreo!: Date;

  hora_inicio!: Date;
  hora_fin!: Date;

  constructor(
    private primengConfig: PrimeNGConfig
  ) { }

  ngOnInit() {
    this.initMap();
    this.listaVehiculos();
    this.cargarTipoMonitoreo();
    this.primengConfig.ripple = true;
    this.borrarMarcadores();
  }
  listaVehiculos() {
    this.vehiculo = [
      { name: "New York", code: "NY" },
      { name: "Rome", code: "RM" },
      { name: "London", code: "LDN" },
      { name: "Istanbul", code: "IST" },
      { name: "Paris", code: "PRS" }
    ];
  }
  cargarTipoMonitoreo() {
    this.tipo_monitoreo = [
      { name: 'Australia', code: 'AU' },
      { name: 'Brazil', code: 'BR' },
      { name: 'China', code: 'CN' },
      { name: 'Egypt', code: 'EG' },
      { name: 'France', code: 'FR' },
      { name: 'Germany', code: 'DE' },
      { name: 'India', code: 'IN' },
      { name: 'Japan', code: 'JP' },
      { name: 'Spain', code: 'ES' },
      { name: 'United States', code: 'US' }
    ];
  }
  initMap() {
    let icon = {
      icon: L.icon({
        iconSize: [35, 41],
        iconAnchor: [13, 0],
        iconUrl: './../../../assets/icono/marcadores/vehiculo/vehiculo-verde.svg',
        // shadowUrl: './node_modules/leaflet/dist/images/marker-shadow.png'
      })
    };
    this.map = L.map('map').setView([51.505, -0.09], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    let aux_marker = [];

    aux_marker.push(["Gabi0", -17.198523456999723, -65.93333306827111]);
    aux_marker.push(["Gabi1", -17.38956005084005, -66.27963734093431]);
    aux_marker.push(["Gabi2", -17.393299391500843, -66.23027725735787]);

    let latitud: any;
    let longitud: any;
    let marker: any;
    //for consulta para devolver los datos 
    latitud = aux_marker[0][1];
    longitud = aux_marker[0][2];
    marker = L.marker([latitud, longitud], icon).addTo(this.map);
    marker.bindPopup("<b>Prueba1</b><br>I am a popup.").openPopup();
    //fin for

    // marker.push(["Prueba3", -17.389150512147936, -66.27980905487269], icon).addTo(this.map);
    // marker.bindPopup("<b>Prueba3</b><br>I am a popup.").openPopup();

    // marker = L.marker([-17.411661350287144, -66.16585785382303], icon).addTo(this.map);
    // marker.bindPopup("<b>Gabi!</b><br>I am a popup.").openPopup();

    // marker = L.marker([-17.389150512147936, -66.27980905487269], icon).addTo(this.map);
    // marker.bindPopup("<b>Gabi!</b><br>I am a popup.").openPopup();

    // const marker = L.marker([51.5, -0.09], icon).addTo(this.map);
    // marker.bindPopup("<b>Hello world!</b><br>I am a popup.").openPopup();
  }
  borrarMarcadores() {

  }
}
