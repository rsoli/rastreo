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
    this.tiles.addTo(this.map);
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
    this.map = L.map('map', {
      center: [-17.41321900407772, -66.16198313658319],
      zoom: 6
    });
    this.tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      // maxZoom: 18,
      // minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });
  }

}
