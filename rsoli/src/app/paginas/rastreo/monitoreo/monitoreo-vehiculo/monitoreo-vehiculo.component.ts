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

    const marker = L.marker([51.5, -0.09], icon).addTo(this.map);
    marker.bindPopup("<b>Hello world!</b><br>I am a popup.").openPopup();
  }


}
