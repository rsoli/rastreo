import { Component, Input, OnInit } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-draw';
import { latLng, Map, tileLayer, featureGroup } from "leaflet";

import { ActivatedRoute } from '@angular/router';
import { Router} from '@angular/router';
import Swal from'sweetalert2';
import { MonitoreoService } from '../monitoreo.service';
import { GeocercaModelo } from '../geocerca-model';

@Component({
  selector: 'app-modal-area',
  templateUrl: './modal-area.component.html',
  styleUrls: ['./modal-area.component.css']
})
export class ModalAreaComponent implements OnInit {

  map!: Map;

	drawnItems: L.FeatureGroup = featureGroup();

	options = {
		
		layers: [
			tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png")
		],
		zoom: 6,
		center: latLng(-16.6574403011881, -64.95190911770706),
		edit: {
			featureGroup: this.drawnItems
		}
		
	};

	drawOptions: any = {
		position: 'topleft',
		draw: {
			marker: false,
			//polyline:false,
			circlemarker:false,
			rectangle:false
		},
		/*edit: {
			featureGroup: this.drawnItems
		}*/
	};
	drawLocal: any = {
		draw: {
			toolbar: {
				buttons: {
					circle:'Dibuje un círculo',
					polygon: 'Dibuje un Polígono',
					rectangle: 'Dibuje un Rectángulo',
					polyline:'Dibuje Polilíneas'
				}
			}
		}
	};

	tipo_area:string="";
	area:string="";
	modelo_geocerca= new GeocercaModelo();

	onDrawCreated(e: any) {
		
		const { layerType, layer } = e;
		this.BorrarArea();
		this.tipo_area="";
		console.log("Layer type ",layerType	);
		if (layerType === "polygon") {
			this.tipo_area="Polígono";
			const polygonCoordinates = layer._latlngs;
			console.log(polygonCoordinates);
			let formato_poligono='POLYGON((';
			let contador=0;
			for (let numero of polygonCoordinates[0]){
				contador++;
				console.log(numero.lat);
				if(polygonCoordinates[0].length==contador){
					formato_poligono+=numero.lat+' '+numero.lng;
				}else{
					formato_poligono+=numero.lat+' '+numero.lng+', ';
				}
			}
			formato_poligono+='))';
			//console.log(formato_poligono);
			this.area=formato_poligono;
			//POLYGON((8.527252342994226 76.93943949479721, 8.522456487330741 76.93892464926041, 8.522583811709909 76.93300392558731, 8.526488405413433 76.93369038630301))
			//POLYGON((-17.397793096463374 -66.2039629211835, -17.397771894751813 -66.20479610179541, -17.399902654471262 -66.2049183016185, -17.399966258857333 -66.20206326938833, -17.39880017493043 -66.20197439678972, -17.398789574133332 -66.20251874145617, -17.397358460885187 -66.2023632144086, -17.397358460885187 -66.2030964133471, -17.397835499879108 -66.20320750409536, -17.397793096463374 -66.2039629211835))
		}
		if (layerType === 'circle') {
			this.tipo_area="Circulo";
			const circleCoordinates = layer.getLatLng();
			var theRadius = layer.getRadius();
			//console.log(circleCoordinates);
			//console.log("radius",theRadius);
			var formato_circulo='CIRCLE ('+circleCoordinates.lat+' '+circleCoordinates.lng+', '+theRadius+')';
			//console.log("format circulo ",formato_circulo);
			this.area=formato_circulo;
			//CIRCLE (8.525427378462332 76.92863181683016, 283.2081557202603)
			//CIRCLE (-17.399224653912114 -66.2036559221288, 176.7)
		}
		if(layerType === 'polyline'){
			this.tipo_area="Polilínea";
			const polylineCoordinates = layer._latlngs;
			console.log(polylineCoordinates);

			let formato_polyline='LINESTRING(';
			let contador=0;
			for (let numero of polylineCoordinates){
				contador++;
				console.log(numero.lat);
				if(polylineCoordinates.length==contador){
					formato_polyline+=numero.lat+' '+numero.lng;
				}else{
					formato_polyline+=numero.lat+' '+numero.lng+', ';
				}
			}
			formato_polyline+=')';
			//console.log(formato_polyline);
			this.area=formato_polyline;
			//LINESTRING(8.522626253160213 76.92901346562437, 8.524833202083125 76.93768049513707, 8.52075882489071 76.9373372464435, 8.519782665575068 76.93124458213259)
			//LINESTRING (52.79634264517895 -0.2037202593981779, 45.00702091793775 3.944718313485426, 47.53377112571371 11.25721402195101, 50.39474786783924 18.147841167718216, 55.0722893177832 16.811902594834613, 48.660732643656274 7.2494036677182185, 50.929586611244446 7.108780813485431)
		}

		this.drawnItems.addLayer(e.layer);
	}
	BorrarArea(){
		this.drawnItems.clearLayers();
	}

	id_area!:Number;

  constructor(
    private router: Router,
	private route: ActivatedRoute,
	private monitoreo_servicio: MonitoreoService
  ) { }

  ngOnInit(): void {
	this.id_area = Number(this.route.snapshot.paramMap.get("id"));
	new L.Control.Draw(this.options);
  }

  Volver(){
    this.router.navigate(['/rastreo/lista_geocerca']); 
  }
  GuardarArea(){
	this.loading();
	if(this.area){
		this.modelo_geocerca.area=this.area;
		this.modelo_geocerca.id=Number(this.id_area);
		this.modelo_geocerca.tipo_geocerca=this.tipo_area;
		
		this.monitoreo_servicio.post_area(this.modelo_geocerca).subscribe(data=>{
			this.close();
			if(JSON.parse(JSON.stringify(data)).mensaje[0]){
			  this.error('Error!!',JSON.parse(JSON.stringify(data)).mensaje[0]);
			}else{
				this.router.navigate(['/rastreo/lista_geocerca']); 
			}
		  },error=>{
			this.close();
			this.error("Error","Verifique su conexion a internet");
			console.log(error);
		  });
	}else{
		this.close();
	}
  }
  loading(){
    Swal.fire({
      title: 'Verificando datos',
      html: 'Cargando',// add html attribute if you want or remove
      allowOutsideClick: false,
      didOpen: () => {
          Swal.showLoading()
      },
    });
    
  }
  close(){
    Swal.close();
  }
  error(titulo:string,mensaje:string){
    Swal.fire({
      icon: 'error',
      title: titulo,
      text: mensaje
    });
  }
}
